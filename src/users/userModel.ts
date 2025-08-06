
import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Simple email validation regex

    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Password must be at least 6 characters long

    },
}, { timestamps: true });

const User = mongoose.model<User>("User", userSchema);

export default User;
