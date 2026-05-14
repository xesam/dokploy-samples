import { Job } from 'bull';

interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

export const processEmailJob = async (job: Job<EmailJobData>) => {
  console.log(`[${new Date().toISOString()}] 📧 发送邮件任务开始`);
  console.log(`  收件人: ${job.data.to}`);
  console.log(`  主题: ${job.data.subject}`);

  const progress = { sent: 0, total: 10 };
  for (let i = 0; i < progress.total; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    progress.sent++;
    await job.progress(Math.round((progress.sent / progress.total) * 100));
  }

  console.log(`[${new Date().toISOString()}] ✅ 邮件发送完成: ${job.data.to}`);

  return { success: true, sentAt: new Date().toISOString() };
};