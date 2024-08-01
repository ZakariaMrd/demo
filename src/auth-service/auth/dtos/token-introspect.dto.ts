import { IsString } from 'class-validator';

export class TokenIntrospectDto {
  @IsString()
  readonly access_token: string;
}
