import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export enum Role {
  USER = 'USER',
  MOD = 'MOD',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class UserEntity {
  @Transform(({ value }: { value: ObjectId }) => `${value}`)
  public _id!: string;

  @Prop({
    lowercase: true,
    trim: true,
  })
  public firstName!: string;

  @Prop({
    lowercase: true,
    trim: true,
  })
  public lastName!: string;

  @Prop({
    trim: true,
  })
  public phoneNumber!: string;

  @Prop({
    trim: true,
  })
  public country!: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  public email!: string;

  @Prop({
    required: true,
  })
  public password!: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.USER,
  })
  public role!: Role;

  @Prop({
    type: Date,
  })
  public dateOfBirth!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

UserSchema.set('toJSON', {
  virtuals: true,
});
