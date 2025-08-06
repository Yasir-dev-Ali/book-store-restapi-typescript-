import { HttpError } from "http-errors";
import { Request, Response, NextFunction } from "express";
// Global error handler middleware
// This middleware catches errors thrown in the application and formats the response
// It can be used to handle different types of errors uniformly
import dotenv from "dotenv";
dotenv.config();

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    // Handle specific error types
    const statusCode = err.status || 500;
    
    return res.status(statusCode).json({
        status: err.status,
        message: err.message,
        errorstack: process.env.NODE_ENV === "development" ? null : err.stack, // Hide stack trace in production
    });
}


export default globalErrorHandler;
