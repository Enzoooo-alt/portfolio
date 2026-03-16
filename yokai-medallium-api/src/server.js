import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import yokaiRoutes from './routes/yokaiRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4010);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.use('/api/yokai', yokaiRoutes);

app.listen(port, () => {
  console.log(`Yo-kai Medallium API démarrée sur http://localhost:${port}`);
});
