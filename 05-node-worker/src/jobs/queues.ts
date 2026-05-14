import Queue from 'bull';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const emailQueue = new Queue('email-queue', REDIS_URL);
export const processingQueue = new Queue('processing-queue', REDIS_URL);
export const reportQueue = new Queue('report-queue', REDIS_URL);

export const addEmailJob = async (to: string, subject: string, body: string) => {
  return await emailQueue.add({ to, subject, body }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
};

export const addProcessingJob = async (taskType: string, data: any) => {
  return await processingQueue.add({ taskType, data, timestamp: new Date().toISOString() }, {
    attempts: 3,
    backoff: { type: 'fixed', delay: 2000 }
  });
};

export const addReportJob = async (reportType: string, dateRange: { start: string; end: string }) => {
  return await reportQueue.add({ reportType, dateRange }, {
    attempts: 2,
    removeOnComplete: true,
    removeOnFail: false
  });
};

export const closeAllQueues = async () => {
  await emailQueue.close();
  await processingQueue.close();
  await reportQueue.close();
};