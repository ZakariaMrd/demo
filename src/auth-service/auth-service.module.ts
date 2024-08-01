import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthGuard, KeycloakConnectModule, TokenValidation } from 'nest-keycloak-connect';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { KeycloakApiModule } from './keyckloak-api/keyckloak-api.module';
import { APP_GUARD } from '@nestjs/core';



@Module({
  imports: [
    ConfigModule.forRoot(), 
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('AUTH_SERVER_URL'),
        realm: configService.get<string>('REALM'),
        clientId: configService.get<string>('CLIENT_ID'),
        secret: configService.get<string>('CLIENT_SECRET'),
        tokenValidation: TokenValidation.ONLINE,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    KeycloakApiModule,
  ],
  providers:[{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }]
})
export class AuthServiceModule {}
