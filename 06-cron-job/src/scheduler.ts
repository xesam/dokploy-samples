import cron, { ScheduledTask } from 'node-cron';

interface TaskConfig {
  name: string;
  schedule: string;
  description: string;
}

interface ExecutionRecord {
  taskName: string;
  startTime: Date;
  endTime: Date;
  success: boolean;
  error?: string;
}

class CronScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private executionHistory: ExecutionRecord[] = [];
  private maxHistorySize: number = 100;

  private readonly taskConfigs: TaskConfig[] = [
    {
      name: 'heartbeat',
      schedule: '*/30 * * * *',
      description: '每 30 秒发送心跳检测'
    },
    {
      name: 'dailyReport',
      schedule: '0 8 * * *',
      description: '每天早上 8 点生成日报'
    },
    {
      name: 'cleanup',
      schedule: '0 2 * * *',
      description: '每天凌晨 2 点清理临时文件'
    },
    {
      name: 'backup',
      schedule: '0 */6 * * *',
      description: '每 6 小时执行数据备份'
    },
    {
      name: 'healthCheck',
      schedule: '*/1 * * * *',
      description: '每分钟执行健康检查'
    }
  ];

  private logTaskStart(taskName: string): void {
    console.log(`[${new Date().toISOString()}] ⏰ 任务开始: ${taskName}`);
  }

  private logTaskComplete(taskName: string, success: boolean, error?: string): void {
    const status = success ? '✅' : '❌';
    console.log(`[${new Date().toISOString()}] ${status} 任务完成: ${taskName}${error ? ` - ${error}` : ''}`);
  }

  private recordExecution(record: ExecutionRecord): void {
    this.executionHistory.push(record);
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory.shift();
    }
  }

  private executeHeartbeat(): void {
    this.logTaskStart('heartbeat');
    const startTime = new Date();
    try {
      console.log('   💓 发送心跳 ping...');
      console.log(`   📊 系统状态: OK`);
      console.log(`   🕐 服务器时间: ${new Date().toISOString()}`);
      this.recordExecution({
        taskName: 'heartbeat',
        startTime,
        endTime: new Date(),
        success: true
      });
      this.logTaskComplete('heartbeat', true);
    } catch (error) {
      this.recordExecution({
        taskName: 'heartbeat',
        startTime,
        endTime: new Date(),
        success: false,
        error: (error as Error).message
      });
      this.logTaskComplete('heartbeat', false, (error as Error).message);
    }
  }

  private executeDailyReport(): void {
    this.logTaskStart('dailyReport');
    const startTime = new Date();
    try {
      console.log('   📝 生成每日报告...');
      console.log('   📊 收集今日数据...');
      const mockData = {
        totalUsers: Math.floor(Math.random() * 1000) + 500,
        totalOrders: Math.floor(Math.random() * 500) + 100,
        revenue: (Math.random() * 10000 + 5000).toFixed(2)
      };
      console.log(`   👥 用户总数: ${mockData.totalUsers}`);
      console.log(`   🛒 订单总数: ${mockData.totalOrders}`);
      console.log(`   💰 营收: $${mockData.revenue}`);
      console.log('   ✅ 报告生成完成');
      this.recordExecution({
        taskName: 'dailyReport',
        startTime,
        endTime: new Date(),
        success: true
      });
      this.logTaskComplete('dailyReport', true);
    } catch (error) {
      this.recordExecution({
        taskName: 'dailyReport',
        startTime,
        endTime: new Date(),
        success: false,
        error: (error as Error).message
      });
      this.logTaskComplete('dailyReport', false, (error as Error).message);
    }
  }

  private executeCleanup(): void {
    this.logTaskStart('cleanup');
    const startTime = new Date();
    try {
      console.log('   🧹 开始清理临时文件...');
      console.log('   📁 扫描临时目录...');
      const filesToDelete = Math.floor(Math.random() * 50) + 10;
      console.log(`   🗑️  删除 ${filesToDelete} 个临时文件`);
      console.log('   💾 清理缓存...');
      console.log('   ✅ 清理完成');
      this.recordExecution({
        taskName: 'cleanup',
        startTime,
        endTime: new Date(),
        success: true
      });
      this.logTaskComplete('cleanup', true);
    } catch (error) {
      this.recordExecution({
        taskName: 'cleanup',
        startTime,
        endTime: new Date(),
        success: false,
        error: (error as Error).message
      });
      this.logTaskComplete('cleanup', false, (error as Error).message);
    }
  }

  private executeBackup(): void {
    this.logTaskStart('backup');
    const startTime = new Date();
    try {
      console.log('   💾 开始数据备份...');
      console.log('   📦 导出数据库...');
      console.log('   ☁️ 上传到云存储...');
      const backupSize = (Math.random() * 100 + 50).toFixed(2);
      console.log(`   📊 备份大小: ${backupSize} MB`);
      console.log('   ✅ 备份完成');
      this.recordExecution({
        taskName: 'backup',
        startTime,
        endTime: new Date(),
        success: true
      });
      this.logTaskComplete('backup', true);
    } catch (error) {
      this.recordExecution({
        taskName: 'backup',
        startTime,
        endTime: new Date(),
        success: false,
        error: (error as Error).message
      });
      this.logTaskComplete('backup', false, (error as Error).message);
    }
  }

  private executeHealthCheck(): void {
    this.logTaskStart('healthCheck');
    const startTime = new Date();
    try {
      console.log('   🔍 检查系统健康状态...');
      const status = {
        cpu: (Math.random() * 100).toFixed(1) + '%',
        memory: (Math.random() * 100).toFixed(1) + '%',
        disk: (Math.random() * 100).toFixed(1) + '%',
        responseTime: Math.floor(Math.random() * 200) + 50 + 'ms'
      };
      console.log(`   🖥️  CPU: ${status.cpu}`);
      console.log(`   💿 内存: ${status.memory}`);
      console.log(`   📀 磁盘: ${status.disk}`);
      console.log(`   ⚡ 响应时间: ${status.responseTime}`);
      this.recordExecution({
        taskName: 'healthCheck',
        startTime,
        endTime: new Date(),
        success: true
      });
      this.logTaskComplete('healthCheck', true);
    } catch (error) {
      this.recordExecution({
        taskName: 'healthCheck',
        startTime,
        endTime: new Date(),
        success: false,
        error: (error as Error).message
      });
      this.logTaskComplete('healthCheck', false, (error as Error).message);
    }
  }

  public start(): void {
    console.log('🚀 启动 Cron 任务调度器...\n');

    this.taskConfigs.forEach(config => {
      console.log(`   📋 注册任务: ${config.name} (${config.schedule})`);
      console.log(`      → ${config.description}`);

      let task: ScheduledTask;

      switch (config.name) {
        case 'heartbeat':
          task = cron.schedule(config.schedule, () => this.executeHeartbeat());
          break;
        case 'dailyReport':
          task = cron.schedule(config.schedule, () => this.executeDailyReport());
          break;
        case 'cleanup':
          task = cron.schedule(config.schedule, () => this.executeCleanup());
          break;
        case 'backup':
          task = cron.schedule(config.schedule, () => this.executeBackup());
          break;
        case 'healthCheck':
          task = cron.schedule(config.schedule, () => this.executeHealthCheck());
          break;
        default:
          console.log(`   ⚠️ 未知任务: ${config.name}`);
          return;
      }

      this.tasks.set(config.name, task);
    });

    console.log('\n✅ 所有任务已注册\n');
    console.log('=' .repeat(50));
    console.log('任务调度器状态: 运行中');
    console.log(`注册的任務數量: ${this.tasks.size}`);
    console.log('='.repeat(50) + '\n');
  }

  public stop(): void {
    console.log('\n🛑 停止 Cron 任务调度器...');
    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`   ⏹️  已停止: ${name}`);
    });
    console.log('✅ 所有任务已停止\n');
  }

  public getTasks(): TaskConfig[] {
    return this.taskConfigs;
  }

  public getHistory(): ExecutionRecord[] {
    return this.executionHistory;
  }

  public getTaskStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    this.tasks.forEach((task, name) => {
      status[name] = task.getStatus() === 'scheduled';
    });
    return status;
  }
}

export { CronScheduler, TaskConfig, ExecutionRecord };