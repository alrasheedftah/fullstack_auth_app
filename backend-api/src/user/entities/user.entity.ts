import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class BaseDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}

@Schema({ versionKey: false })
export class User extends BaseDocument {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
