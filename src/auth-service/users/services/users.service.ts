import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ReturnedUserDto } from '../dtos/returned-user.dto';
import { UsersDao } from '../daos/users.dao';
import { isValidObjectId } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { User } from '../schemas/users.schema';
import { PaginatedModelDto } from 'src/shared/dtos/paginated-model.dto';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';
import { ReturnedUserMapper } from '../dtos/mappers/returned-user.mapper';
import { ConfigService } from '@nestjs/config';
import { KeycloakApiService } from '../../keyckloak-api/services/keycloak-api.service';
import { Client } from '../../keyckloak-api/entities/classes/client.class';
import {
  KeycloakUser,
  Credentials,
} from '../../keyckloak-api/entities/classes/keycloak-user.class';

@Injectable()
export class UsersService {
  private realm: string = '';
  private client: Client;
  constructor(
    private readonly usersDao: UsersDao,
    private configService: ConfigService,
    private keycloakApiService: KeycloakApiService,
    private logger: Logger,
  ) {
    this.realm = this.configService.get('REALM');
    this.client = new Client(
      this.configService.get('CLIENT_SECRET'),
      this.configService.get('CLIENT_ID'),
    );
    this.logger = new Logger(UsersService.name);
  }

  async create(
    createUserDto: CreateUserDto,
    accessToken,
  ): Promise<ReturnedUserDto> {
    let createdUser = {} as User;
    let userKeyCloackId;
    try {
      // Register the user in Keycloak
      const keycloakUser = new KeycloakUser(
        createUserDto.username,
        createUserDto.firstname,
        createUserDto.lastname,
        createUserDto.email,
        createUserDto.password,
        createUserDto.active
      );
      const keyCloakUserCreateResponse = await this.keycloakApiService
        .createUser(keycloakUser, this.realm, accessToken)
        .toPromise();

      const location: string = keyCloakUserCreateResponse.headers.location;
      const split = location.split('/');
       userKeyCloackId = split[split.length - 1];

      // Register user in database first
      const creationDate: Date = new Date();
      const metaData: MetaData = {
        createdAt: creationDate,
        updatedAt: creationDate,
        createdBy: null,
        updatedBy: null,
      } as MetaData;
      var createUser: User = {
        email: createUserDto.email,
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        username: createUserDto.username,
        keyCloakUserId: userKeyCloackId,
        metaData,
        active: createUserDto.active
      } as User;
      createdUser = await this.usersDao.create(createUser);

      return ReturnedUserMapper.mapToReturnedUserDto(createdUser);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        const deletedUser = await this.keycloakApiService.deleteUser(userKeyCloackId, this.realm, accessToken)
        throw new ConflictException('Username or email already exists');
      }
      if (createdUser && createdUser._id) {
        const result = await this.usersDao.delete(createdUser._id);
      }
      this.logger.error(
        `Failed To Create User :>> ${
          error?.response?.data?.errorMessage ||
          error?.response?.data?.error ||
          error
        }`,
      );
      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedModelDto<ReturnedUserDto>> {
    const result = await this.usersDao.findAll(page, limit);
    return {
      docs: result.docs.map(ReturnedUserMapper.mapToReturnedUserDto),
      meta: result.meta,
    };
  }

  async findById(id: string): Promise<ReturnedUserDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    const user = await this.usersDao.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id: ${id} was not found`);
    }
    return ReturnedUserMapper.mapToReturnedUserDto(user);
  }

  async findOne(filter: Partial<User>): Promise<ReturnedUserDto> {
    const user = await this.usersDao.findOne(filter);
    if (!user) {
      throw new NotFoundException(
        `User with filter: ${JSON.stringify(filter)} was not found`,
      );
    }
    return ReturnedUserMapper.mapToReturnedUserDto(user);
  }

  async activatedOrDisactivateAccount(
    userId: string,
    accessToken: string,
    active: boolean,
  ) {
    const user = await this.findById(userId);
    await this.keycloakApiService.activateOrDisactivateUser(
      user.keyCloakUserId,
      this.realm,
      accessToken,
      active,
    );

    user.active = active;
    return await this.usersDao.update(userId, user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    accessToken?: string,
  ): Promise<ReturnedUserDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    const existingUser = await this.usersDao.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with id: ${id} was not found`);
    }
    const updateDate = new Date();
    const userToUpdate = {
      _id: existingUser._id,
      email: updateUserDto.email ? updateUserDto.email : existingUser.email,
      firstname: updateUserDto.firstname
        ? updateUserDto.firstname
        : existingUser.firstname,
      lastname: updateUserDto.lastname
        ? updateUserDto.lastname
        : existingUser.lastname,
      metaData: {
        createdAt: existingUser.metaData.createdAt,
        createdBy: existingUser.metaData.createdBy,
        updatedAt: updateDate,
        updatedBy: existingUser.metaData.updatedBy,
      } as MetaData,
      username: existingUser.username,
    } as User;
    try {
      // update user in mongo
      const updatedUser = await this.usersDao.update(id, userToUpdate);

      // update user in keycloak

      // get the user from keyckloak
      let keycloakUser: KeycloakUser = (
        await this.keycloakApiService.getUserById(
          existingUser.keyCloakUserId,
          this.realm,
          accessToken,
        )
      ).data;

      // update the values and save them in keycloak
      keycloakUser = {
        ...keycloakUser,
        email: updateUserDto.email ? updateUserDto.email : keycloakUser.email,
        firstName: updateUserDto.firstname
          ? updateUserDto.firstname
          : keycloakUser.firstName,
        lastName: updateUserDto.lastname
          ? updateUserDto.lastname
          : keycloakUser.lastName,
        credentials: updateUserDto.password
          ? [new Credentials(updateUserDto.password)]
          : keycloakUser.credentials,
      };
      await this.keycloakApiService.updateUser(
        updatedUser.keyCloakUserId,
        this.realm,
        keycloakUser,
        accessToken,
      );

      return ReturnedUserMapper.mapToReturnedUserDto(updatedUser);
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('Username or email already exists');
      } else {
        const updatedUser = await this.usersDao.update(id, existingUser);
      }
      throw error;
    }
  }

  async delete(id: string, accessToken: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    let result: User;
    try {
      const user = await this.usersDao.findById(id);
      // delete user from keycloak first then delete it from mongo
      const userToDelete = await this.findById(id);
      await this.keycloakApiService.deleteUser(
        user.keyCloakUserId,
        this.realm,
        accessToken,
      );
      result = await this.usersDao.delete(id);
    } catch (error) {
      if (!result) {
        throw new NotFoundException(`User with id: ${id} was not found`);
      }
      throw error;
    }
  }
}
