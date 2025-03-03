import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.model";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env";

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done: (err: any, user?: any) => void) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5500/api/v1/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          fullname: profile.displayName,
          email: profile.emails?.[0]?.value,
        });
        await newUser.save();
        done(null, { newUser, accessToken, refreshToken });
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);
