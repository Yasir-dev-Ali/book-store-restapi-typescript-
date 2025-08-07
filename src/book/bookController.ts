
import BookModel from "./bookModel";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// Create a new book
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, author, coverImage, filePath, description, price, publishedDate, category } = req.body;
        // Validate book data
        if (!title || !author || !coverImage || !filePath || !description || !price || !publishedDate || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Create a new book instance
        const newBook = new BookModel({
            title,
            author,
            coverImage,
            filePath,
            description,
            price,
            publishedDate,
            category,
            stock: 0, // Default stock to 0, can be updated later
        });
        // Save the book to the database
        await newBook.save();
        // Respond with the created book
        return res.status(201).json({
            message: 'Book created successfully',
            book: newBook,
        });
    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};

// Get all books
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

// Export all controllers
