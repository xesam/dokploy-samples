import dotenv from 'dotenv';
import { emailQueue, processingQueue, reportQueue, closeAllQueues } from './jobs/queues';
import { processEmailJob } from './jobs/emailJob';
import { processDataJob } from './jobs/processingJob';
import { generateReport } from './jobs/reportJob';

dotenv.config();

console.log('🔧 Worker 启动中...');

emailQueue.process(3, async (job) => {
  return await processEmailJob(job);
});

processingQueue.process(2, async (job) => {
  return await processDataJob(job);
});

reportQueue.process(1, async (job) => {
  return await generateReport(job);
});

[emailQueue, processingQueue, reportQueue].forEach(queue => {
  queue.on('completed', (job, result) => {
    console.log(`[${new Date().toISOString()}] ✅ 任务 ${job.id} 完成:`, result);
  });

  queue.on('failed', (job, err) => {
    console.error(`[${new Date().toISOString()}] ❌ 任务 ${job.id} 失败:`, err.message);
  });

  queue.on('progress', (job, progress) => {
    console.log(`[${new Date().toISOString()}] 📈 任务 ${job.id} 进度: ${progress}%`);
  });

  queue.on('stalled', (job) => {
    console.warn(`[${new Date().toISOString()}] ⚠️ 任务 ${job.id} 已停滞`);
  });
});

console.log('✅ Worker 已就绪');
console.log('  - 邮件队列处理器: 3 并发');
console.log('  - 数据处理队列处理器: 2 并发');
console.log('  - 报告生成队列处理器: 1 并发');

process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，正在关闭 Worker...');
  await closeAllQueues();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('收到 SIGINT 信号，正在关闭 Worker...');
  await closeAllQueues();
  process.exit(0);
});