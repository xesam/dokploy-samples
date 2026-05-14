import { Job } from 'bull';

interface ProcessingJobData {
  taskType: string;
  data: any;
  timestamp: string;
}

export const processDataJob = async (job: Job<ProcessingJobData>) => {
  console.log(`[${new Date().toISOString()}] ⚙️ 数据处理任务开始`);
  console.log(`  任务类型: ${job.data.taskType}`);
  console.log(`  提交时间: ${job.data.timestamp}`);

  const totalSteps = 5;
  for (let step = 1; step <= totalSteps; step++) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const operations = [
      '验证输入数据...',
      '执行数据转换...',
      '计算统计信息...',
      '生成处理结果...',
      '保存处理记录...'
    ];

    console.log(`  [${step}/${totalSteps}] ${operations[step - 1]}`);
    await job.progress(Math.round((step / totalSteps) * 100));
  }

  const result = {
    processedAt: new Date().toISOString(),
    taskType: job.data.taskType,
    recordsProcessed: Math.floor(Math.random() * 1000) + 100
  };

  console.log(`[${new Date().toISOString()}] ✅ 数据处理完成`);
  console.log(`  处理记录数: ${result.recordsProcessed}`);

  return result;
};