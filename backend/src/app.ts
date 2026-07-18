import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
