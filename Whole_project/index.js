// WHOLE_PROJECT/index.js
import express from 'express';
import cors from 'cors';
import connectDB from './WHOLE_PROJECT/db.js'; // Your DB connection file
import 'dotenv/config'; // Ensures .env variables are loaded

import authRoutes from './routes/authRoutes.js'; // Your authentication routes

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server (Single User Model) is running!' });
});

// 404 Not Found Middleware for any routes not matched above
app.use('*', (req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl} - Route not found` });
});

// Global Error Handler Middleware (should be the last app.use())
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler ---');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Path:', req.path);
  console.error('Error Message:', err.message);
  // For more detailed debugging, you can uncomment the stack trace log
  // console.error('Error Stack:', err.stack);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode) || 500;
  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred.',
    // Optionally, in development, you might want to send the stack:
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 MongoDB connection attempt initiated (Target DB: myWholeProjectDB via .env)...`);
  console.log(`📍 Local Backend: http://localhost:${PORT}`);
  console.log('=================================');
});