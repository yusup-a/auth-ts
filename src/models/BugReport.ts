import { getModelForClass, prop, Ref, modelOptions } from "@typegoose/typegoose";
import { UserClass } from "./User";

@modelOptions({ schemaOptions: { timestamps: true, collection: "bugreports" } })
export class BugReportClass {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ type: () => [String], default: [] })
  public images!: string[];

  @prop({ required: true, enum: ["Low", "Medium", "High"] })
  public priority!: "Low" | "Medium" | "High";

  @prop()
  public browser?: string;

  @prop()
  public reproducibleSteps?: string;

  @prop({ ref: () => UserClass, required: true })
  public submittedBy!: Ref<UserClass>;
}

export const BugReportModel = getModelForClass(BugReportClass);
