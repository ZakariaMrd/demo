import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';

    
        @Schema({ _id: false })
        export class Provider {
              @Prop({ 
                type: mongoose.Schema.Types.String,
                
                
                
                
              })
              source: string;
              @Prop({ 
                type: mongoose.Schema.Types.String,
                
                
                
                
              })
              service: string;
              @Prop({ 
                type: mongoose.Schema.Types.String,
                
                
                
                
              })
              connector: string;
        }
    
        export const ProviderSchema = SchemaFactory.createForClass(Provider);

    @Schema({ _id: false })
    export class Def {
          @Prop({ type: Provider, required: true })
          provider: Provider;
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            
            
          })
          ressourceType: string;
    }

    export const DefSchema = SchemaFactory.createForClass(Def);

    @Schema({ _id: false })
    export class Control {
          @Prop({ 
            type: mongoose.Schema.Types.Number,
            
            
            default: 1,
            min: 1,
            max: 5,
          })
          count: number;
    }

    export const ControlSchema = SchemaFactory.createForClass(Control);

    @Schema({ _id: false })
    export class Refs {
          @Prop({ 
            type: mongoose.Schema.Types.String,
            
            
            
            
          })
          pri: string;
    }

    export const RefsSchema = SchemaFactory.createForClass(Refs);

export type ServicegroupDocument = Servicegroup & Document;

@Schema()
export class Servicegroup {
      @Prop({ 
        type: mongoose.Schema.Types.String,
        
        
        
        maxlength: 25,
      })
      name: string;
      @Prop({ 
        type: mongoose.Schema.Types.String,
        
        
        
        
      })
      description: string;
      @Prop({ 
        type: mongoose.Schema.Types.String,
        
        
        default: 'WebWorker',
        
      })
      stack: string;
      @Prop({ type: Def, required: true })
      def: Def;
      @Prop({ type: Control, required: true })
      control: Control;
      @Prop({ type: Refs, required: true })
      refs: Refs;

  @Prop()
  metadata: MetaData;
}

export const ServicegroupSchema = SchemaFactory.createForClass(Servicegroup);
