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
import { getHomePage } from "./controllers/home.controller";
import homeRouter from "./routes/home.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key", // Thay thế bằng khóa bí mật của bạn
    resave: false, // Không lưu lại session nếu không thay đổi
    saveUninitialized: false, // Không lưu session mới mà không có dữ liệu
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
