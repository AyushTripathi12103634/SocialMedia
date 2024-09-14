import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            unique: true,
        },
        verified: {
            type: Boolean,
            default: false
        },
        prev_username: {
            type: String,
            trim: true
        },
        prev_username_exp: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Auth", authSchema);
