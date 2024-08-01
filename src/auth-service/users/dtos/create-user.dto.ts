import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsStrongPassword} from 'class-validator';
export class CreateUserDto {

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @Transform(({ value }) => value === true? true:false)
  @IsBoolean()
  @IsOptional()
  active:boolean;

}
