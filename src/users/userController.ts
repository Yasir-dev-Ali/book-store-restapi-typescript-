import { NextFunction, Request, Response } from 'express';
import User from './userModel';
import mongoose from 'mongoose';
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

    // Create a new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId().toString(),
      name: username,
      email,
      password,
    });

    await newUser.save();

    // Respond with success message
    res.status(201).json({
        message: "User registered successfully",
        user: {
          username: newUser.name,
          email: newUser.email,
        },
      });
      
  } catch (error: any) {
    res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Export the user registration function
export default userRegister;