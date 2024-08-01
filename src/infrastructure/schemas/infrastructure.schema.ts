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
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  description: string;
}

export const InfoSchema = SchemaFactory.createForClass(Info);

@Schema({ _id: false })
export class Provider {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  source: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  })
  ref: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  role: string;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);

@Schema({ _id: false })
export class Zone {
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  region: string;
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  subR: string;
  @Prop({
    type: mongoose.Schema.Types.String,
  })
  code: string;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);

@Schema({ _id: false })
export class Definition {
  @Prop({ type: Provider, required: true })
  provider: Provider;
  @Prop({ type: Zone, required: true })
  zone: Zone;
}

export const DefinitionSchema = SchemaFactory.createForClass(Definition);

export type InfrastructureDocument = Infrastructure & Document;

@Schema()
export class Infrastructure {
  @Prop({ type: Info, required: true })
  info: Info;
  @Prop({ type: Definition, required: true })
  definition: Definition;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Servicegroup' }],
  })
  refs: mongoose.Types.ObjectId[];

  @Prop()
  metadata: MetaData;
}

export const InfrastructureSchema =
  SchemaFactory.createForClass(Infrastructure);
