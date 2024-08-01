import { IsString } from 'class-validator';

export class LoginParamsDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

}
