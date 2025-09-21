import { getModelForClass, prop, Ref, modelOptions } from "@typegoose/typegoose";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { timestamps: true } })
export class FeatureRequestClass {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ type: () => [String], default: [] })
  public images!: string[];

  @prop({ required: true, enum: ["Nice-to-have", "Important", "Critical"] })
  public priority!: "Nice-to-have" | "Important" | "Critical";

  @prop()
  public targetAudience?: string;

  @prop()
  public expectedBenefit?: string;

  @prop({ ref: () => UserClass, required: true })
  public submittedBy!: Ref<UserClass>;
}

export const FeatureRequestModel = getModelForClass(FeatureRequestClass);
