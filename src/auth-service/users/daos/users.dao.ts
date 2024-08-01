import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { PaginatedModelDto } from 'src/shared/dtos/paginated-model.dto';

@Injectable()
export class UsersDao {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUser: User): Promise<User> {
    try {
      const createdUser = new this.userModel(createUser);
      return await createdUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedModelDto<User>> {
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      this.userModel
        .find()
        .sort({ 'metaData.createdAt': -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      docs,
      meta: {
        page,
        limit,
        count: docs.length,
        totalDocs: totalDocs > 0 ? totalDocs : 1,
        totalPages,
        next: hasNextPage ? page + 1 : null,
        previous: hasPreviousPage ? page - 1 : null,
      },
    };
  }

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findOne(filter: Partial<User>): Promise<User> {
    return await this.userModel.findOne(filter).exec();
  }

  async update(id: string, userToUpdate: User): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(id, userToUpdate, { new: true })
      .exec();
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
