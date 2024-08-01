import { HttpException, Injectable, Logger } from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { KeycloakUser } from '../entities/classes/keycloak-user.class';
import { Observable, catchError, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as queryString from 'querystring';
@Injectable()
export class KeycloakApiService {
    keycloak_url: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private logger: Logger
  ) {
    this.keycloak_url = configService.get('AUTH_SERVER_URL');
  }

  createUser(
    data: KeycloakUser,
    realm: string,
    accessTokenJWT: string,
  ): Observable<AxiosResponse> {
    try{

      return this.httpService.post(
        `${this.keycloak_url}/admin/realms/${realm}/users`,
        { ...data },
        {
          headers: {
            Authorization: `${accessTokenJWT}`,
          },
        },
      );
    }catch(err){
      throw err
    }
  }

  getUserById(keyCloakUserId: string, realm: string, accessToken: string) {
    return this.httpService.get(
      `${this.keycloak_url}/admin/realms/${realm}/users/${keyCloakUserId}`,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    ).toPromise();
  }

  updateUser(userId: string, realm: string, userRepresentation: KeycloakUser, accessToken: string) {
    return this.httpService.put(
      `${this.keycloak_url}/admin/realms/${realm}/users/${userId}`,
      userRepresentation,
      {
        headers: {
          Authorization: `${accessToken}`,
        },
      },
    ).toPromise();
  }

  async activateOrDisactivateUser(
    keycloakUserId: string,
    realmName: string,
    accessTokenJWT: string,
    active: boolean
  ) {
    try {
      const KeyCloakUser: KeycloakUser = (await this.httpService.get(
        `${this.keycloak_url}/admin/realms/${realmName}/users/${keycloakUserId}`,
        {
          headers: {
            Authorization: `${accessTokenJWT}`,
          },
          timeout: 0
        }
      ).toPromise()).data;
      KeyCloakUser.enabled = active;
      return await this.httpService.put(
        `${this.keycloak_url}/admin/realms/${realmName}/users/${keycloakUserId}`,
        KeyCloakUser,
        {
          headers: {
            Authorization: `${accessTokenJWT}`,
          },
          timeout: 0
        }
      ).toPromise()
    } catch (err) {
      console.log('---------------- error while enabling/disabling a user :', err)
      throw new HttpException(err.response?.data, err.response.status)
    }

  }

  deleteUser(userId: string, realm: string, accessTokenJWT: string) {
    return this.httpService.delete(
      `${this.keycloak_url}/admin/realms/${realm}/users/${userId}`,
      {
        headers: {
          Authorization: `${accessTokenJWT}`,
        },
      },
    ).toPromise();
  }

  getRpt(realm: string, accessToken: string, audience: string) {
    const postBody = queryString.stringify({
      'grant_type': 'urn:ietf:params:oauth:grant-type:uma-ticket',
      'audience': audience,
    })
    console.log(accessToken)
    return this.httpService
      .post(
        `${this.keycloak_url}/realms/${realm}/protocol/openid-connect/token`,
        postBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      ).pipe(
        catchError((err) => {
          this.logger.error(`error while getting an RPT : ${err}`)
          return throwError(err)
        })
      )
  }
}
