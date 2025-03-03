import { Router } from "express";
import { changePassword, googleAuth, googleAuthCallback, resetPassword, signIn, signOut, signUp } from "../controllers/auth.controller";
import { validateChangePassword, validateResetPassword, validateSignInUser, validateSignUpUser } from "../middlewares/validation";

const authRouter = Router();

authRouter.post("/sign-up", validateSignUpUser, signUp);
authRouter.post("/sign-in", validateSignInUser, signIn);
authRouter.post("/logout", signOut);
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleAuthCallback);

authRouter.post("/reset-password", validateResetPassword, resetPassword);
authRouter.post("/change-password", validateChangePassword, changePassword);

export default authRouter;
