import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { Document } from 'mongoose';
import { PaginationMetadata } from './index';
import { QueryOptionsDto } from './query-options.dto';
import { MetadataInterceptor } from './interceptors/metadata.interceptor';

@Controller()
@UseInterceptors(MetadataInterceptor)
export class BaseController<T extends Document> {
  constructor(private readonly baseService: BaseService<T>) {}

  @Get()
  async find(
    @Query(new ValidationPipe({ transform: true }))
    queryOptions: QueryOptionsDto,
  ): Promise<{ docs: T[]; metadata: PaginationMetadata }> {
    return await this.baseService.find(queryOptions);
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Query() queryOptions: QueryOptionsDto,
  ): Promise<T> {
    return await this.baseService.findById(id, queryOptions);
  }

  @Post()
  async create(@Body() data: any): Promise<T> {
    return await this.baseService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any): Promise<T> {
    return await this.baseService.update(id, updateData);
  }

  @Patch(':id/sections')
  async updateSections(
    @Param('id') id: string,
    @Body() updateData: any,
  ): Promise<T> {
    return await this.baseService.updateSections(id, updateData.sections.list);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<T> {
    return await this.baseService.delete(id);
  }
}
