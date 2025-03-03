"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, email, password } = req.body;
        const existingUser = yield User_model_1.default.find({ email });
        if (existingUser) {
            const error = new Error("User already exist");
            error.statusCode = 409;
            throw error;
        }
        if (password.length < 8) {
            const error = Error("Password at least 8 chracters");
            error.statusCode = 400;
            throw error;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield User_model_1.default.create([
            {
                name,
                email,
                password: hashedPassword,
            },
        ], { session });
        if (!env_1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        // const token = jwt.sign({ userId: newUser[0]._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: "User created successful",
            data: {
                // token,
                user: newUser[0],
            },
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        next(error);
    }
});
exports.signUp = signUp;
