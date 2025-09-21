import { Schema, model, Types } from "mongoose";


export interface IFeedback {
    message: string;
    imageUrl?: string;
    user: Types.ObjectId;
}


const feedbackSchema = new Schema<IFeedback>({
    message: { type: String, required: true },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });


export const Feedback = model<IFeedback>("Feedback", feedbackSchema);