import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        cb(null, `${Date.now()}-${base}${ext}`);
    }
});


const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.mimetype);
    if (!ok) return cb(new Error("Only image files are allowed"));
    cb(null, true);
};


export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });