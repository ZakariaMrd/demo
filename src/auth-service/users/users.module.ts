import { Module, Logger } from '@nestjs/common';
import { UsersDao } from './daos/users.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { KeycloakApiModule } from '../keyckloak-api/keyckloak-api.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), KeycloakApiModule,
  HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
  })],
  controllers:[UsersController],
  providers: [UsersService, UsersDao, Logger, ConfigService],
  exports: [UsersService],
})
export class UsersModule {}
