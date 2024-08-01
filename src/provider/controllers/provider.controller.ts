import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query, Req, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ProviderService } from '../services/provider.service';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { Provider, ProviderDocument } from '../schemas/provider.schema';
import { BaseController } from 'src/shared/base.controller';
import { Request } from 'express';

@Controller('providers')
export class ProviderController extends BaseController<ProviderDocument> {
  constructor(private readonly providerService: ProviderService) {
    super(providerService);
  }

@Post()
@UsePipes(new ValidationPipe({ transform: true }))
create(@Body() createProviderDto: CreateProviderDto) {
  return this.providerService.create(createProviderDto);
}

@Put(':id')
@UsePipes(new ValidationPipe({ transform: true }))
update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
  return this.providerService.update(id, updateProviderDto);
}


}
