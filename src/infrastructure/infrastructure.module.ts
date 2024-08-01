import { Module } from '@nestjs/common';
import { InfrastructureService } from './services/infrastructure.service';
import { InfrastructureController } from './controllers/infrastructure.controller';
import {
  Infrastructure,
  InfrastructureSchema,
} from './schemas/infrastructure.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InfrastructureDao } from './dao/infrastructure.dao';
import { IsValidReferenceGuardV2 } from './guards/infrastructure.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Infrastructure.name,
        schema: InfrastructureSchema,
      },
    ]),
  ],
  controllers: [InfrastructureController],
  providers: [
    InfrastructureService,
    InfrastructureDao,
    IsValidReferenceGuardV2,
  ],
})
export class InfrastructureModule {}
