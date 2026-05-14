import dotenv from 'dotenv';
import { CronScheduler } from './scheduler';

dotenv.config();

const scheduler = new CronScheduler();

scheduler.start();

const heartbeatInterval = setInterval(() => {
  console.log(`[${new Date().toISOString()}] ❤️  心跳保活中...`);
}, 10000);

process.on('SIGTERM', () => {
  console.log('\n收到 SIGTERM 信号，正在关闭...');
  clearInterval(heartbeatInterval);
  scheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n收到 SIGINT 信号，正在关闭...');
  clearInterval(heartbeatInterval);
  scheduler.stop();
  process.exit(0);
});