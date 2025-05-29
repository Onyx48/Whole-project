// index.js
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import usersRoutes from './routes/users.js';
import 'dotenv/config'; // Ensures .env variables are loaded

const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // Allow cookies/authorization headers
}));

// Body parser middleware to handle JSON and URL-encoded data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Connect to database
connectDB(); // Call the function to establish MongoDB connection

// Test route to check if server is working
app.get('/', (req, res) => {
  res.json({
    message: 'Backend server is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Your API routes for users
// All routes defined in routes/users.js will be prefixed with /api/users
app.use('/api/users', usersRoutes);

// 404 handler for any routes not matched above
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler middleware
// This should be the last app.use()
app.use((err, req, res, next) => {
  console.error('Error Timestamp:', new Date().toISOString());
  console.error('Error Path:', req.path);
  console.error('Error Stack:', err.stack); // Log the full error stack for debugging
  res.status(err.status || 500).json({ // Use error status if available, otherwise default to 500
    message: err.message || 'Something went wrong!', // Use error message if available
    // Optionally, in development, you might want to send the stack:
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 MongoDB connection attempt initiated...`); // Added to show db connection is being called
  console.log(`📍 Local Backend: http://localhost:${PORT}`);
  console.log(`🌐 Expected Frontend: http://localhost:5173`);
  console.log('=================================');
});