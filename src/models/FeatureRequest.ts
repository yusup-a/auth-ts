import { Schema, model, Types } from "mongoose";


export interface IFeatureRequest {
    title: string;
    description: string;
    imageUrl?: string;
    user: Types.ObjectId;
}


const featureSchema = new Schema<IFeatureRequest>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });


export const FeatureRequest = model<IFeatureRequest>("FeatureRequest", featureSchema);