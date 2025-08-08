
import BookModel from "./bookModel";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary/cloudinary";
import User from "../users/userModel";

// export const createBook = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // console.log(req.files);
//         const files = req.files as { [fileName: string]: Express.Multer.File[] };
//         const filePath = req.files as { [fileName: string]: Express.Multer.File[] };
       


//         const coverImageType = files.coverImage[0].mimetype.split('/')[1];
//         const filePathFile = filePath.coverImage[0].filename;
//         const uploadResponse = await cloudinary.uploader.upload(filePathFile, {
//             folder: 'books',
//             resource_type: 'image',
//             public_id: `cover_${Date.now()}`,
//             overwrite: true,
//         });
//         console.log(uploadResponse);
//         const newBook = new BookModel({
//             title: req.body.title,
//             author: req.body.author,
//             coverImage: {
//                 url: uploadResponse.secure_url,
//                 type: coverImageType,
//             },
//             filePath: filePathFile,
//             description: req.body.description,
//             price: req.body.price,
//             publishedDate: req.body.publishedDate,
//             category: req.body.category,
//         });
//         await newBook.save();
//         return res.status(201).json({
//             message: 'Book created successfully',
//             book: newBook,
//         });
//     } catch (error: any) {
//         return next(createHttpError(500, error.message));
//     }
// };
   

// Get all books

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files.coverImage || !files.filePath) {
            return res.status(400).json({ message: 'Cover image and book file are required' });
        }

        const coverImageFile = files.coverImage[0];
        const bookFile = files.filePath[0];

        const coverImageType = coverImageFile.mimetype.split('/')[1];

        // Upload cover image to Cloudinary
        const uploadedCover = await cloudinary.v2.uploader.upload(coverImageFile.path, {
            folder: 'books/covers',
            resource_type: 'image',
            public_id: `cover_${Date.now()}`,
            overwrite: true,
        });

        // Upload book file (e.g., PDF) to Cloudinary
        const uploadedBookFile = await cloudinary.v2.uploader.upload(bookFile.path, {
            folder: 'books/files',
            resource_type: 'raw', // This is important for PDFs or docs
            public_id: `book_${Date.now()}`,
            overwrite: true,
        });


        const user = await User.findOne({ username: req.body.author });
        if (!user) {
            return res.status(400).json({ message: 'Author not found' });
        }

        const newBook = new BookModel({
            title: req.body.title,
            author: user._id,
            coverImage: uploadedCover.secure_url, // or change schema to allow object
            filePath: uploadedBookFile.secure_url,
            description: req.body.description,
            price: req.body.price,
            publishedDate: req.body.publishedDate,
            category: req.body.category,
        });

        // Create and save book entry
        // const newBook = new BookModel({
        //     title: req.body.title,
        //     author: req.body.author,
        //     coverImage: {
        //         url: uploadedCover.secure_url,
        //         type: coverImageType,
        //     },
        //     filePath: uploadedBookFile.secure_url, // Save Cloudinary file URL
        //     description: req.body.description,
        //     price: req.body.price,
        //     publishedDate: req.body.publishedDate,
        //     category: req.body.category,
        // });

        await newBook.save();

        return res.status(201).json({
            message: 'Book created successfully',
            book: newBook,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};




export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookModel.find().populate('author', 'name email');
        return res.status(200).json({
            message: 'Books retrieved successfully',
            books,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};

// Get a book by ID
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.id;
        const book = await BookModel.findById(bookId).populate('author', 'name email');
        if (!book) {
            return next(createHttpError(404, 'Book not found'));
        }
        return res.status(200).json({
            message: 'Book retrieved successfully',
            book,
        });
    }
    catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};

// Update a book by ID
export const updateBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.id;
        const { title, author, coverImage, filePath, description, price, publishedDate, category } = req.body;
        // Validate book data
        if (!title || !author || !coverImage || !filePath || !description || !price || !publishedDate || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Find the book and update it
        const updatedBook = await BookModel.findByIdAndUpdate(
            bookId,
            {
                title,
                author,
                coverImage,
                filePath,
                description,
                price,
                publishedDate,
                category,
            },
            { new: true }
        ).populate('author', 'name email');
        if (!updatedBook) {
            return next(createHttpError(404, 'Book not found'));
        }
        return res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook,
        });
    }
    catch (error: any) {
        return next(createHttpError(500, error.message));

    }
}

// Delete a book by ID
export const deleteBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.id;
        const deletedBook = await BookModel.findByIdAndDelete(bookId);
        if (!deletedBook) {
            return next(createHttpError(404, 'Book not found'));
        }
        return res.status(200).json({
            message: 'Book deleted successfully',
            book: deletedBook,
        });
    }
    catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};

// Search books by title
export const searchBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.query;
        if (!title) {
            return res.status(400).json({ message: 'Title query parameter is required' });
        }
        const books = await BookModel.find({ title: { $regex: title, $options: 'i' } }).populate('author', 'name email');
        return res.status(200).json({
            message: 'Books retrieved successfully',
            books,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};
// Get books by category
export const getBooksByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'Category query parameter is required' });
        }
        const books = await BookModel.find({ category: { $regex: category, $options: 'i' } }).populate('author', 'name email');
        return res.status(200).json({
            message: 'Books retrieved successfully',
            books,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};

// Get books by author
export const getBooksByAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorId } = req.query;
        if (!authorId) {
            return res.status(400).json({ message: 'Author ID query parameter is required' });
        }
        const books = await BookModel.find({ author: authorId }).populate('author', 'name email');
        return res.status(200).json({
            message: 'Books retrieved successfully',
            books,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};



