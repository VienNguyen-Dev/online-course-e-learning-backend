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
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const mongodb_1 = __importDefault(require("./database/mongodb"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const home_route_1 = __importDefault(require("./routes/home.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your_secret_key", // Thay thế bằng khóa bí mật của bạn
    resave: false, // Không lưu lại session nếu không thay đổi
    saveUninitialized: false, // Không lưu session mới mà không có dữ liệu
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api/v1", home_route_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/courses", course_routes_1.default);
app.use(error_middleware_1.default);
app.listen(env_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${env_1.PORT}`);
    yield (0, mongodb_1.default)();
}));
exports.default = app;
