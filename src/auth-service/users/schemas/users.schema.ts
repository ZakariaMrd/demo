import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MetaData } from 'src/shared/entities/classes/meta-data.class';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export class User {
  _id:string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({required:true, unique:true})
  username: string;

  @Prop({unique:true})
  email: string;

  @Prop()
  keyCloakUserId: string;

  @Prop({type:Boolean, default:true})
  active:boolean;

  @Prop()
  metaData: MetaData;
}


export const UserSchema = SchemaFactory.createForClass(User);
