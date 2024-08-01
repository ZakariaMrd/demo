import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { InfrastructureService } from '../services/infrastructure.service';
import { CreateInfrastructureDto } from '../dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from '../dto/update-infrastructure.dto';
import { Infrastructure, InfrastructureDocument } from '../schemas/infrastructure.schema';
import { BaseController } from 'src/shared/base.controller';
import { Request } from 'express';
import { IsValidReferenceGuardV2 } from '../guards/infrastructure.guard';

@Controller('infrastructures')
export class InfrastructureController extends BaseController<InfrastructureDocument> {
  constructor(private readonly infrastructureService: InfrastructureService) {
    super(infrastructureService);
  }

@Post()
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(IsValidReferenceGuardV2)
create(@Body() createInfrastructureDto: CreateInfrastructureDto) {
  return this.infrastructureService.create(createInfrastructureDto);
}

@Put(':id')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(IsValidReferenceGuardV2)
update(@Param('id') id: string, @Body() updateInfrastructureDto: UpdateInfrastructureDto) {
  return this.infrastructureService.update(id, updateInfrastructureDto);
}


}
