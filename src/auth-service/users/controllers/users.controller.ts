import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersService } from '../services/users.service';
import { ReturnedUserDto } from '../dtos/returned-user.dto';
import { PaginatedModelDto } from 'src/shared/dtos/paginated-model.dto';
import { User } from '../schemas/users.schema';
import { KeycloakRestApiToken } from '../../decorators/keycloak-rest-api-token.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @KeycloakRestApiToken() accessToken: string,
  ): Promise<ReturnedUserDto> {
    return await this.usersService.create(createUserDto, accessToken);
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginatedModelDto<ReturnedUserDto>> {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ReturnedUserDto> {
    return this.usersService.findById(id);
  }

  @Get('filter')
  async findOne(@Query() filter: Partial<User>): Promise<ReturnedUserDto> {
    return this.usersService.findOne(filter);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @KeycloakRestApiToken() accessToken: string,
  ): Promise<ReturnedUserDto> {
    return await this.usersService.update(id, updateUserDto, accessToken);
  }

  @Patch(':id/active')
  async updateAccountActivity(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @KeycloakRestApiToken() accessToken: string,
  ) {
    return await this.usersService.activatedOrDisactivateAccount(
      id,
      accessToken,
      updateUserDto.active,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @KeycloakRestApiToken() accessToken: string): Promise<void> {
    return await this.usersService.delete(id, accessToken);
  }
}
