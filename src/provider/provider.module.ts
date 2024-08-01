import { Module } from '@nestjs/common';
import { ProviderService } from "./services/provider.service";
import { ProviderController } from "./controllers/provider.controller";
import { Provider, ProviderSchema } from "./schemas/provider.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { ProviderDao } from './dao/provider.dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Provider.name,
        schema: ProviderSchema
      },
    ])
  ],
  controllers: [ProviderController],
  providers: [
    ProviderService, 
    ProviderDao
  ]
})
export class ProviderModule {}
