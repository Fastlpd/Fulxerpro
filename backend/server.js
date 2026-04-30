import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FulxerPro API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

export default app;
