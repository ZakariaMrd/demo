import {
  IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString,
  Max, MaxDate, MaxLength, Min, MinDate, IsMongoId, ValidateNested, IsOptional, ArrayNotEmpty, ArrayUnique, ArrayContains, IsIn
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';


      class Info {
              @IsString()
              @IsOptional()
              
              @MaxLength(25, { message: 'Name must be at most 25 characters long.' })
              
              name: string;
        
        
      }
     
      class Def {
              @IsString()
              @IsOptional()
              
              
              @IsIn(["infra", "project", "certificates"], { message: 'Category must be one of the accepted values.' })
              category: string;
        
        
              @IsString()
              @IsOptional()
              
              
              
              source: string;
        
        
              @IsString()
              @IsOptional()
              
              
              @IsIn(["onPrimise", "cloud"], { message: 'Role must be one of the accepted values.' })
              role: string = 'onPrimise'
        
        
      }
     

export class CreateProviderDto {
      @ValidateNested()
      @Type(() => Info)
      @IsOptional()
      info: Info;
      @ValidateNested()
      @Type(() => Def)
      @IsOptional()
      def: Def;

   @IsOptional()
  @IsObject()
  @Type(() => MetaData)
  @ValidateNested()
  metadata: MetaData;
}
