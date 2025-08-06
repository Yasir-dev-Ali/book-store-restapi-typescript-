import { NextFunction, Request, Response } from 'express';
import User from './userModel';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { access } from 'fs';
// User registration controller
const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user data from request body
      const { username, password, email } = req.body;
    // Validate user data (this is a simple example, you might want to add more validation)
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
      }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
      }
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      if (!salt) {
        return res.status(500).json({ message: "Error generating salt" });
      }
      const hashedPassword = await bcrypt.hash(password, salt);
        // Check if password hashing was successful
    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
      }

      
    // Note: In a real application, you should handle JWT generation and storage securely


    //   Token generation can be added here if needed

    // Create a new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId().toString(),
      name: username,
      email,
        password: hashedPassword,
       
    });
    // Token generation can be added here if needed
    const token = newUser.jwt = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, {
        expiresIn: '7h' // Token expiration time
    });
      
     
    await newUser.save();

    // Respond with success message
    res.status(201).json({
        message: "User registered successfully",
        user: {
          username: newUser.name,
            email: newUser.email,
            accessToken: token, // Include the JWT token in the response

        },
      });
      
  } catch (error: any) {
    res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Export the user registration function
export default userRegister;