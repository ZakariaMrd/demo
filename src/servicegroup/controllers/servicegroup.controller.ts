import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ServicegroupService } from '../services/servicegroup.service';
import { CreateServicegroupDto } from '../dto/create-servicegroup.dto';
import { UpdateServicegroupDto } from '../dto/update-servicegroup.dto';
import { Servicegroup, ServicegroupDocument } from '../schemas/servicegroup.schema';
import { BaseController } from 'src/shared/base.controller';
import { Request } from 'express';

@Controller('servicegroups')
export class ServicegroupController extends BaseController<ServicegroupDocument> {
  constructor(private readonly servicegroupService: ServicegroupService) {
    super(servicegroupService);
  }

@Post()
@UsePipes(new ValidationPipe({ transform: true }))
create(@Body() createServicegroupDto: CreateServicegroupDto) {
  return this.servicegroupService.create(createServicegroupDto);
}

@Put(':id')
@UsePipes(new ValidationPipe({ transform: true }))
update(@Param('id') id: string, @Body() updateServicegroupDto: UpdateServicegroupDto) {
  return this.servicegroupService.update(id, updateServicegroupDto);
}


}
