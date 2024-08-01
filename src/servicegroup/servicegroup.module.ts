import { Module } from '@nestjs/common';
import { ServicegroupService } from "./services/servicegroup.service";
import { ServicegroupController } from "./controllers/servicegroup.controller";
import { Servicegroup, ServicegroupSchema } from "./schemas/servicegroup.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ServicegroupDao } from './dao/servicegroup.dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Servicegroup.name,
        schema: ServicegroupSchema
      },
    ])
  ],
  controllers: [ServicegroupController],
  providers: [
    ServicegroupService, 
    ServicegroupDao
  ]
})
export class ServicegroupModule {}
