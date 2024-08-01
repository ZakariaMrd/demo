import {
  IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject, IsString,
  Max, MaxDate, MaxLength, Min, MinDate, IsMongoId, ValidateNested, IsOptional, ArrayNotEmpty, ArrayUnique, ArrayContains, IsIn
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';


           class Provider {
                   @IsString()
                   @IsOptional()
                   
                   
                   @IsIn(["aws", "vm"], { message: 'Source must be one of the accepted values.' })
                   source: string;
             
             
                   @IsString()
                   @IsOptional()
                   
                   
                   
                   service: string;
             
             
                   @IsString()
                   @IsOptional()
                   
                   
                   
                   connector: string;
             
             
           }
          
      class Def {
            @ValidateNested()
            @Type(() => Provider)
            @IsOptional()
            provider: Provider;
              @IsString()
              @IsOptional()
              
              
              @IsIn(["vm", "service"], { message: 'RessourceType must be one of the accepted values.' })
              ressourceType: string;
        
        
      }
     
      class Control {
              @IsNumber()
              @IsOptional()
              
              @Min(1, { message: 'The minimum value for Count is 1.' })
              @Max(5, { message: 'The maximum value for Count is 5.' })
              
              count: number = 1
        
        
      }
     
      class Refs {
              @IsString()
              @IsOptional()
              
              
              
              pri: string;
        
        
      }
     

export class CreateServicegroupDto {
        @IsString()
        @IsOptional()
        
        @MaxLength(25, { message: 'Name must be at most 25 characters long.' })
        
        name: string;
  
  
        @IsString()
        @IsOptional()
        
        
        
        description: string;
  
  
        @IsString()
        @IsOptional()
        
        
        @IsIn(["WebWorker", "Gateway", "DB", "Storage"], { message: 'Stack must be one of the accepted values.' })
        stack: string = 'WebWorker'
  
  
      @ValidateNested()
      @Type(() => Def)
      @IsOptional()
      def: Def;
      @ValidateNested()
      @Type(() => Control)
      @IsOptional()
      control: Control;
      @ValidateNested()
      @Type(() => Refs)
      @IsOptional()
      refs: Refs;

   @IsOptional()
  @IsObject()
  @Type(() => MetaData)
  @ValidateNested()
  metadata: MetaData;
}
