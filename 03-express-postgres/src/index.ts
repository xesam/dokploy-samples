import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './db/prisma';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import healthRoutes from './routes/health';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('错误:', err.message);
  res.status(500).json({ error: '服务器内部错误' });
});

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Express 服务器运行在端口 ${PORT}`);
    console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();