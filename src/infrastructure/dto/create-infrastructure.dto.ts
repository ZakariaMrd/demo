import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  IsMongoId,
  ValidateNested,
  IsOptional,
  ArrayNotEmpty,
  ArrayUnique,
  ArrayContains,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';

class Info {
  @IsString()
  @IsOptional()
  @MaxLength(25, { message: 'Name must be at most 25 characters long.' })
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

class Provider {
  @IsString()
  @IsOptional()
  @IsIn(['aws', 'vm'], {
    message: 'Source must be one of the accepted values.',
  })
  source: string;

  @IsMongoId({ message: ' must be a valid ID.' })
  @IsOptional()
  ref: string;

  @IsString()
  @IsOptional()
  @IsIn(['cloud', 'onPrimise'], {
    message: 'Role must be one of the accepted values.',
  })
  role: string;
}

class Zone {
  @IsString()
  @IsOptional()
  @IsIn(['USA', 'Africa', 'Europe'], {
    message: 'Region must be one of the accepted values.',
  })
  region: string;

  @IsString()
  @IsOptional()
  subR: string;

  @IsString()
  @IsOptional()
  code: string;
}

class Definition {
  @ValidateNested()
  @Type(() => Provider)
  @IsOptional()
  provider: Provider;
  @ValidateNested()
  @Type(() => Zone)
  @IsOptional()
  zone: Zone;
}

export class CreateInfrastructureDto {
  @ValidateNested()
  @Type(() => Info)
  @IsOptional()
  info: Info;
  @ValidateNested()
  @Type(() => Definition)
  @IsOptional()
  definition: Definition;
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true, message: ' must be a valid ID.' })
  refs: string[];

  @IsOptional()
  @IsObject()
  @Type(() => MetaData)
  @ValidateNested()
  metadata: MetaData;
}
