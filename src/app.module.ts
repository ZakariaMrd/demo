import { ServicegroupModule } from './servicegroup/servicegroup.module';
import { ProviderModule } from './provider/provider.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthServiceModule } from './auth-service/auth-service.module';

@Module({
  imports: [
    AuthServiceModule,
    ServicegroupModule,
    ProviderModule,
    InfrastructureModule,
    MongooseModule.forRoot('mongodb://127.0.0.1/api'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
