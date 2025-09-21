import { Schema, model, Types } from "mongoose";


export interface IBugReport {
    title: string;
    description: string;
    imageUrl?: string;
    user: Types.ObjectId;
}


const bugSchema = new Schema<IBugReport>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });


export const BugReport = model<IBugReport>("BugReport", bugSchema);