import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

import { pool } from './config/database';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorMiddleware';

// Import ROUTES (pas controllers !)
import userRoutes from './routes/users';
import companyRoutes from './routes/companies';
import jobRoutes from './routes/jobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (_req, res) => {
  res.send('✅ Sugu-Link Backend is running!');
});

// Routes principales (préfixées par /api pour correspondre au frontend)
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);

// Middleware erreur
app.use(errorHandler);

// Démarrage serveur
const startServer = async () => {
  try {
    await pool.connect();
    console.log('✅ PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();