"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.RESEND_API_KEY = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.NODE_ENV = exports.DB_URI = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
_a = process.env, exports.PORT = _a.PORT, exports.DB_URI = _a.DB_URI, exports.NODE_ENV = _a.NODE_ENV, exports.JWT_SECRET = _a.JWT_SECRET, exports.JWT_EXPIRES_IN = _a.JWT_EXPIRES_IN, exports.GOOGLE_CLIENT_ID = _a.GOOGLE_CLIENT_ID, exports.GOOGLE_CLIENT_SECRET = _a.GOOGLE_CLIENT_SECRET, exports.RESEND_API_KEY = _a.RESEND_API_KEY, exports.CLOUDINARY_CLOUD_NAME = _a.CLOUDINARY_CLOUD_NAME, exports.CLOUDINARY_API_KEY = _a.CLOUDINARY_API_KEY, exports.CLOUDINARY_API_SECRET = _a.CLOUDINARY_API_SECRET;
