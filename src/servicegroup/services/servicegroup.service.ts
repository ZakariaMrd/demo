import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { BaseService } from 'src/shared/base.service';
import { CreateServicegroupDto } from "../dto/create-servicegroup.dto";
import { UpdateServicegroupDto } from "../dto/update-servicegroup.dto";
import { Servicegroup, ServicegroupDocument } from "../schemas/servicegroup.schema";
import { ServicegroupDao } from "../dao/servicegroup.dao";

@Injectable()
export class ServicegroupService extends BaseService<ServicegroupDocument> {
  constructor(private readonly servicegroupDao: ServicegroupDao) {
    super(servicegroupDao); 
  }

  async create(createServicegroupDto: CreateServicegroupDto): Promise<ServicegroupDocument> {
    // Check for unique constraints conditionally

    try {
      return await super.create(createServicegroupDto);
    } catch (error) {
      if (error.code === 11000) {  // MongoDB duplicate key error code
        throw new ConflictException('Duplicate key error: Some field violates a uniqueness constraint');
      }
      throw new BadRequestException(error.message);  // General error handling
    }
  }

}
