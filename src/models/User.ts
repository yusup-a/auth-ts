import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class UserClass {
  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  // Store the **bcrypt hash** in this field
  @prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(UserClass);