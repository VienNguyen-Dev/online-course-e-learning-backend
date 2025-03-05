import express from "express";
import { PORT } from "./config/env";
import connectToDatabase from "./database/mongodb";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import userRouter from "./routes/user.routes";
import cookieParser from "cookie-parser";
import courseRouter from "./routes/course.routes";
import session from "express-session";
import passport from "passport";
import "./config/passport";
import homeRouter from "./routes/home.route";

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://online-course-e-learning-frontend.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(
  cors({
    origin: "https://online-course-e-learning-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", homeRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
