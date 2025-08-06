import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './config/Middleware/gloableErrorHandler';

dotenv.config();
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 6000;

// Middleware to parse JSON requests
app.use(express.json());
// Error handling middleware
app.use(errorHandler);


import connectDB from './config/Database/db';

// Connect to MongoDB
connectDB();

// Import user router
import userRouter from './users/userRouter';

app.use('/api/users', userRouter);

app.get('/', (req, res) => {
 res.json({ message: 'Welcome to the API!' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
