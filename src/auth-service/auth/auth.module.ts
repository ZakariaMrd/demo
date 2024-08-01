import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { KeycloakApiModule } from '../keyckloak-api/keyckloak-api.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),
  JwtModule.register({}),
  UsersModule,
  KeycloakApiModule,
  ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
})
export class AuthModule {}
