import { Module, Logger } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios'
import { KeycloakApiService } from './services/keycloak-api.service';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers:[Logger, KeycloakApiService, ConfigService],
  exports:[KeycloakApiService]
})
export class KeycloakApiModule {}
