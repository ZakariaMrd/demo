import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../keyckloak-api/entities/classes/client.class';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

export let token_SAT = '';
const configService = new ConfigService();

export const KeycloakRestApiToken = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const jwtService = new JwtService({});
    const expirationTime =
      token_SAT.length > 0
        ? jwtService.decode(token_SAT.split(' ')[1])['exp']
        : 0;

    // check if the token has been expired to refresh it
    if (expirationTime < Date.now() / 1000 || expirationTime < 0) {
      const client = new Client(
        configService.get('CLIENT_SECRET'),
        configService.get('CLIENT_ID'),
      );

      token_SAT = await getNewToken(client);
    }
    return token_SAT;
  },
);

export async function getNewToken(client: Client): Promise<string> {
  const response = await getKeycloakRestApiToken(client).toPromise();
  token_SAT = `Bearer ${response.data.access_token}`;
  return token_SAT;
}

function getKeycloakRestApiToken(client: Client): Observable<AxiosResponse> {
  const httpService = new HttpService();
  const keyckloakUrl = configService.get('AUTH_SERVER_URL');
  const realm = configService.get('REALM');
  const params = new URLSearchParams();
  params.append('client_secret', client.secret);
  params.append('client_id', client.clientId);
  params.append('grant_type', 'client_credentials');
  try {
    return httpService.post(
      `${keyckloakUrl}/realms/${realm}/protocol/openid-connect/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  } catch (error) {
    throw new HttpException(
      error.response.data?.error || error.response.data,
      error.response.status,
    );
  }
}
