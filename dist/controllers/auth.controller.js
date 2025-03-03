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
exports.changePassword = exports.resetPassword = exports.signOut = exports.googleAuthCallback = exports.googleAuth = exports.signIn = exports.signUp = void 0;
const passport = require("passport");
const User_model_1 = __importDefault(require("../models/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const resend_1 = require("resend");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { fullname, email, password } = req.body;
        const existingUser = yield User_model_1.default.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exist");
            error.statusCode = 409;
            throw error;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield User_model_1.default.create([
            {
                fullname,
                email,
                password: hashedPassword,
            },
        ], { session });
        if (!env_1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ userId: newUser[0]._id }, env_1.JWT_SECRET, { expiresIn: "1d" });
        yield session.commitTransaction();
        session.endSession();
        res.cookie("auth_cookies", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 8640000,
        });
        res.status(201).json({
            success: true,
            message: "User created successful",
            data: {
                token,
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
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, rememberMe } = req.body;
        let user = yield User_model_1.default.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const comparedPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!comparedPassword) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.JWT_SECRET, { expiresIn: "1d" });
        const rememberMeInDB = yield User_model_1.default.findOne({ rememberMe });
        if (rememberMe !== rememberMeInDB)
            user = yield User_model_1.default.findOneAndUpdate({ email }, { rememberMe: rememberMe }, { new: true });
        res.cookie("auth_cookie", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, //save for 7 days
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfuly",
            data: {
                token,
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
exports.googleAuth = passport.authenticate("google", { scope: ["email", "profile"] });
const googleAuthCallback = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport.authenticate("google", (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err || !user) {
            return res.redirect("http://localhost:3000/sign-in");
        }
        const userInfo = req.user;
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("auth_cookies", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
        return res.redirect(`http://localhost:3000?success=true&token=${token}`);
    }))(req, res, next);
});
exports.googleAuthCallback = googleAuthCallback;
// Xử lý thành công
const signOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("auth_cookies", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.signOut = signOut;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resend = new resend_1.Resend(env_1.RESEND_API_KEY);
    try {
        const { email } = req.body;
        const existEmail = yield User_model_1.default.findOne({ email });
        if (!existEmail) {
            const error = new Error("Your account is not yet register");
            error.statusCode = 404;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({ email }, env_1.JWT_SECRET, { expiresIn: "1h" });
        const { data, error } = yield resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Reset Password",
            html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>Hi there,</p>
      <p>You requested to reset your password. Click the button below to reset it:</p>
      <a href="http://localhost:3000/change-password?token=${token}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email or contact support.</p>
      <p>Thanks,</p>
      <p>The Acme Team</p>
    </div>
  `,
        });
        if (error) {
            next(error);
        }
        res.status(200).json({
            success: true,
            message: "Send email successfully. Please check your email",
            data: {
                data,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resetPassword = resetPassword;
// 1. Compare password and passwordConfirm
// 2. Ma hoa
// 3. Luu tru
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password, passwordConfirm } = req.body;
        if (password !== passwordConfirm) {
            const error = new Error("Password and confirm password do not match");
            error.statusCode = 400;
            throw error;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        const email = decoded.email;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const updatedUser = yield User_model_1.default.findOneAndUpdate({ email }, {
            password: hashedPassword,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Changed password successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.changePassword = changePassword;
