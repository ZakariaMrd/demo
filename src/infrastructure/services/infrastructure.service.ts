import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/base.service';
import { CreateInfrastructureDto } from '../dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from '../dto/update-infrastructure.dto';
import {
  Infrastructure,
  InfrastructureDocument,
} from '../schemas/infrastructure.schema';
import { InfrastructureDao } from '../dao/infrastructure.dao';

@Injectable()
export class InfrastructureService extends BaseService<InfrastructureDocument> {
  constructor(private readonly infrastructureDao: InfrastructureDao) {
    super(infrastructureDao);
  }

  async create(
    createInfrastructureDto: CreateInfrastructureDto,
  ): Promise<InfrastructureDocument> {
    // Check for unique constraints conditionally

    try {
      return await super.create(createInfrastructureDto);
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new ConflictException(
          'Duplicate key error: Some field violates a uniqueness constraint',
        );
      }
      throw new BadRequestException(error.message); // General error handling
    }
  }
}
