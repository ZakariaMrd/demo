import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';


    @Schema({ _id: false })
    export class Info {
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            
            maxlength: 25,
          })
          name: string;
    }

    export const InfoSchema = SchemaFactory.createForClass(Info);

    @Schema({ _id: false })
    export class Def {
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            
            
          })
          category: string;
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            
            
          })
          source: string;
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            default: 'onPrimise',
            
          })
          role: string;
    }

    export const DefSchema = SchemaFactory.createForClass(Def);

export type ProviderDocument = Provider & Document;

@Schema()
export class Provider {
      @Prop({ type: Info, required: true })
      info: Info;
      @Prop({ type: Def, required: true })
      def: Def;

  @Prop()
  metadata: MetaData;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
