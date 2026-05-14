import express from 'express';
import dotenv from 'dotenv';
import { addEmailJob, addProcessingJob, addReportJob, emailQueue, processingQueue, reportQueue, closeAllQueues } from './jobs/queues';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/jobs/email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'to, subject, body 是必填项' });
    }
    const job = await addEmailJob(to, subject, body);
    res.status(201).json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: '创建邮件任务失败' });
  }
});

app.post('/jobs/processing', async (req, res) => {
  try {
    const { taskType, data } = req.body;
    if (!taskType) {
      return res.status(400).json({ error: 'taskType 是必填项' });
    }
    const job = await addProcessingJob(taskType, data || {});
    res.status(201).json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: '创建处理任务失败' });
  }
});

app.post('/jobs/report', async (req, res) => {
  try {
    const { reportType, dateRange } = req.body;
    if (!reportType || !dateRange) {
      return res.status(400).json({ error: 'reportType 和 dateRange 是必填项' });
    }
    const job = await addReportJob(reportType, dateRange);
    res.status(201).json({ success: true, jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: '创建报告任务失败' });
  }
});

app.get('/jobs/:queueName/:jobId', async (req, res) => {
  try {
    const { queueName, jobId } = req.params;
    let queue;
    switch (queueName) {
      case 'email': queue = emailQueue; break;
      case 'processing': queue = processingQueue; break;
      case 'report': queue = reportQueue; break;
      default: return res.status(400).json({ error: '未知的队列类型' });
    }
    const job = await queue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: '任务不存在' });
    }
    const state = await job.getState();
    const progress = job.progress();
    res.json({
      id: job.id,
      state,
      progress,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason
    });
  } catch (error) {
    res.status(500).json({ error: '获取任务状态失败' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const [emailStats, processingStats, reportStats] = await Promise.all([
      emailQueue.getJobCounts(),
      processingQueue.getJobCounts(),
      reportQueue.getJobCounts()
    ]);
    res.json({
      emailQueue: emailStats,
      processingQueue: processingStats,
      reportQueue: reportStats
    });
  } catch (error) {
    res.status(500).json({ error: '获取队列统计失败' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`🚀 任务提交服务运行在端口 ${PORT}`);
  console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，正在关闭...');
  await closeAllQueues();
  server.close();
  process.exit(0);
});