import { Router } from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "node:path";


const bookRouter = Router();



// Multer for file uploads

const uploads=multer({
    // dest: path.join(__dirname, '../../uploads'),
    dest: path.resolve(__dirname, '../../public/uploads'),

    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .jpeg, .png, and .gif files are allowed'));
        }
        cb(null, true);
    }
});




bookRouter.post('/books', uploads.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'filePath', maxCount: 1 }
]), createBook);