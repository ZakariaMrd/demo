import { Injectable, ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { BaseService } from 'src/shared/base.service';
import { CreateProviderDto } from "../dto/create-provider.dto";
import { UpdateProviderDto } from "../dto/update-provider.dto";
import { Provider, ProviderDocument } from "../schemas/provider.schema";
import { ProviderDao } from "../dao/provider.dao";

@Injectable()
export class ProviderService extends BaseService<ProviderDocument> {
  constructor(private readonly providerDao: ProviderDao) {
    super(providerDao); 
  }

  async create(createProviderDto: CreateProviderDto): Promise<ProviderDocument> {
    // Check for unique constraints conditionally

    try {
      return await super.create(createProviderDto);
    } catch (error) {
      if (error.code === 11000) {  // MongoDB duplicate key error code
        throw new ConflictException('Duplicate key error: Some field violates a uniqueness constraint');
      }
      throw new BadRequestException(error.message);  // General error handling
    }
  }

}
