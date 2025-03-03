"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        minLength: 3,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // match: [/\S+@\S+\.\S+/, /\S+\.\S+/, "Please fill a valid email address."]
    },
    password: {
        type: String,
        minLegth: 8,
        required: [true, "Password is required"],
    },
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
