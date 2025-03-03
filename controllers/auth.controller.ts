const passport = require("passport");
import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET, RESEND_API_KEY } from "../config/env";
import { Resend } from "resend";

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exist") as { statusCode: number } & Error;
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          fullname,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: "1d" });

    await session.commitTransaction();
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
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, rememberMe } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found") as { statusCode: number } & Error;
      error.statusCode = 404;
      throw error;
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      const error = new Error("Invalid password") as { statusCode: number } & Error;
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET!, { expiresIn: "1d" });
    const rememberMeInDB = await User.findOne({ rememberMe });
    if (rememberMe !== rememberMeInDB) user = await User.findOneAndUpdate({ email }, { rememberMe: rememberMe }, { new: true });

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
  } catch (error) {
    next(error);
  }
};

export const googleAuth = passport.authenticate("google", { scope: ["email", "profile"] });

export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", async (err: any, user: any) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/sign-in");
    }
    const userInfo = req.user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie("auth_cookies", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.redirect(`http://localhost:3000?success=true&token=${token}`);
  })(req, res, next);
};

// Xử lý thành công

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("auth_cookies", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const resend = new Resend(RESEND_API_KEY!);
  try {
    const { email } = req.body;
    const existEmail = await User.findOne({ email });
    if (!existEmail) {
      const error = new Error("Your account is not yet register") as { statusCode: number } & Error;
      error.statusCode = 404;
      throw error;
    }

    const token = jwt.sign({ email }, JWT_SECRET!, { expiresIn: "1h" });
    const { data, error } = await resend.emails.send({
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
  } catch (error) {
    next(error);
  }
};

// 1. Compare password and passwordConfirm
// 2. Ma hoa
// 3. Luu tru
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      const error = new Error("Password and confirm password do not match") as { statusCode: number } & Error;
      error.statusCode = 400;
      throw error;
    }
    const decoded: any = jwt.verify(token, JWT_SECRET!);
    const email = decoded.email;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Changed password successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
