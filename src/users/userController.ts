import { NextFunction, Request, Response } from 'express';
// User registration controller
const userRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user data from request body
      const { username, password, email } = req.body;
    // Validate user data (this is a simple example, you might want to add more validation)
    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
      }
    // Here you would typically hash the password and save the user to the database
    // For demonstration, we will just return the user data
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
    if (!email.includes('@')) {
      return res.status(400).json({ message: "Invalid email address" });
      }

  
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username,
          email,
        // Note: In a real application, you should not return the password
          // password, // Do not return the password in the response
          
      },
    });
      
  } catch (error: any) {
    res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Export the user registration function
export default userRegister;