import { getModelForClass, prop, Ref, modelOptions } from "@typegoose/typegoose";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { timestamps: true } })
export class GeneralFeedbackClass {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ type: () => [String], default: [] })
  public images!: string[];

  @prop({ ref: () => UserClass, required: true })
  public submittedBy!: Ref<UserClass>;
}

export const GeneralFeedbackModel = getModelForClass(GeneralFeedbackClass);
