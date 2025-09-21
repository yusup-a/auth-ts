import { Schema, model, Types } from "mongoose";


interface IUser {
    email: string;
    name: string;
    passwordHash: string; // not used here, but handy
}


const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true }
}, { timestamps: true });


export const User = model<IUser>("User", userSchema);
export type UserId = Types.ObjectId;