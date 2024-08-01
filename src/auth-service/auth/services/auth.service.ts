import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakApiService } from '../../keyckloak-api/services/keycloak-api.service';
import { Client } from '../../keyckloak-api/entities/classes/client.class';
import { Observable, catchError, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as queryString from 'querystring';
import { LoginParamsDto } from '../dtos/login-params.dto';
import { RefreshTokenParamsDto } from '../dtos/refresh-token-params.dto';
import { TokenIntrospectDto } from '../dtos/token-introspect.dto';

@Injectable()
export class AuthService {
  private client: Client;
  private keycloakServer: string;
  private keycloakLoginUrl: string;
  private keycloakLogoutUrl: string;
  private keycloakIsLoggedInUrl: string;
  private realm: string;
  private logger: Logger;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private keycloakService: KeycloakApiService,
  ) {
    this.realm = this.config.get('REALM');
    this.client = new Client(
      config.get('CLIENT_SECRET'),
      config.get('CLIENT_ID'),
    );
    const completURL = `realms/${this.realm}/protocol/openid-connect`;
    this.keycloakServer = config.get('AUTH_SERVER_URL');
    this.keycloakLoginUrl = `${this.keycloakServer}/${completURL}/token`;
    this.keycloakLogoutUrl = `${this.keycloakServer}/${completURL}/logout`;
    this.keycloakIsLoggedInUrl = `${this.keycloakServer}/${completURL}/token/introspect`;
    this.logger = new Logger(AuthService.name);
  }

  async getAccessToken(p: LoginParamsDto) {
    const params = {
      grant_type: 'password',
      client_id: this.client.clientId,
      client_secret: this.client.secret,
      username: p.username,
      password: p.password,
    };
    const token = (await this.http
      .post(this.keycloakLoginUrl, queryString.stringify(params), {
        timeout: 0,
      }).toPromise()).data

    return token;
  }

  async logout(
    refreshTokenParamDto: RefreshTokenParamsDto,
  ): Promise<Observable<AxiosResponse>> {
    const params = {
      refresh_token: refreshTokenParamDto.refresh_token,
      client_id: this.client.clientId,
      client_secret: this.client.secret,
    };

    return await this.http
      .post(this.keycloakLogoutUrl, queryString.stringify(params))
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async refreshAccessToken(
    refreshTokenParamsDto: RefreshTokenParamsDto,
  ): Promise<Observable<AxiosResponse>> {
    const params = {
      grant_type: 'refresh_token',
      client_id: this.client.clientId,
      client_secret: this.client.secret,
      refresh_token: refreshTokenParamsDto.refresh_token,
    };
    return await this.http
      .post(this.keycloakLoginUrl, queryString.stringify(params))
      .pipe(
        map((res) => res.data),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }

  async isLoggedIn(
    tokenIntrospectDto: TokenIntrospectDto,
  ): Promise<Observable<AxiosResponse>> {
    const params = {
      token: tokenIntrospectDto.access_token,
      client_id: this.client.clientId,
      client_secret: this.client.secret,
    };
    return await this.http
      .post(this.keycloakIsLoggedInUrl, queryString.stringify(params))
      .pipe(
        map((res) => res.data.active),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      );
  }
}
