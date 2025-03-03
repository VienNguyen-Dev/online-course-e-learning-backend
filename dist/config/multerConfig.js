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
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinaryConfig_1 = __importDefault(require("./cloudinaryConfig"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryConfig_1.default,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const isImage = file.mimetype.startsWith("image");
        const isVideo = file.mimetype.startsWith("video");
        let format;
        if (isImage) {
            format = "png";
        }
        else if (isVideo) {
            format = "mp4";
        }
        return {
            folder: "/public/storage",
            format: format,
            public_id: `${file.fieldname}-${Date.now()}`,
        };
    }),
});
const upload = (0, multer_1.default)({ storage: storage }).fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
]);
exports.default = upload;
