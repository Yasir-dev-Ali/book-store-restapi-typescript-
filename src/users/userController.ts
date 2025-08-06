import { NextFunction, Request, Response } from 'express';
import User from './userModel';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

// User registration controller
export const userRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract user data from request body
        const { username, password, email } = req.body;

        // Validate user data
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(String(password), 10);

        // Create a new user
        const newUser = new User({
            _id: new mongoose.Types.ObjectId().toHexString(),
            name: username,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = Jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7h' }
        );

        // Attach token to the user object (if needed)
        newUser.jwt = token;

        // Save the new user to the database
        await newUser.save();

        // Respond with success message
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: newUser.name,
                email: newUser.email,
                accessToken: token,
            },
        });

    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};



// Login User 
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        // Validate user data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = Jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7h' }
        );

        // Respond with success message
        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                email: user.email,
                accessToken: token,
            },
        });

    } catch (error: any) {
        return next(createHttpError(500, error.message));
    }
};
