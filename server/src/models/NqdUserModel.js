import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minlength: 3,
            maxlength: 50
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        role: {
            type: String,
            enum: ["ADMIN", "STAFF", "KITCHEN"],
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const User = mongoose.model("User", userSchema);

export default User;