import { IsString } from 'class-validator';

export class RefreshTokenParamsDto {
  @IsString()
  readonly refresh_token: string;

}
