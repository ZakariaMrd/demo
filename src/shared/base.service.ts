import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationMetadata } from './index';
import { BaseDao } from './baseDao';
import { QueryOptionsDto } from './query-options.dto';

@Injectable()
export class BaseService<T extends Document> {
  constructor(private readonly baseDao: BaseDao<T>) {}

  async create(data: any): Promise<T> {
    return await this.baseDao.create(data);
  }

  async find(
    queryOptions: QueryOptionsDto,
  ): Promise<{ docs: T[]; metadata: PaginationMetadata }> {
    return await this.baseDao.find(queryOptions);
  }

  async findById(id: string, queryOptions: QueryOptionsDto = {}): Promise<T> {
    return await this.baseDao.findById(id, queryOptions);
  }

  async update(id: string, updateData: any): Promise<T> {
    return await this.baseDao.update(id, updateData);
  }

  async updateSections(id: string, sectionsList: any): Promise<T> {
    return await this.baseDao.updateSections(id, sectionsList);
  }

  async delete(id: string): Promise<T> {
    return await this.baseDao.delete(id);
  }
}
