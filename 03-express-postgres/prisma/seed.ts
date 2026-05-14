import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始数据库种子数据...');

  const user1 = await prisma.user.upsert({
    where: { email: 'zhangsan@example.com' },
    update: {},
    create: {
      email: 'zhangsan@example.com',
      name: '张三',
      age: 25,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'lisi@example.com' },
    update: {},
    create: {
      email: 'lisi@example.com',
      name: '李四',
      age: 30,
    },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: '欢迎使用 Dokploy',
      content: '这是一个使用 Express + PostgreSQL + Prisma 的示例项目',
      published: true,
      authorId: user1.id,
    },
  });

  await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: '数据库集成教程',
      content: '学习如何在 Dokploy 上部署带数据库的应用',
      published: true,
      authorId: user2.id,
    },
  });

  console.log('种子数据创建完成!');
  console.log(`创建了 ${await prisma.user.count()} 个用户`);
  console.log(`创建了 ${await prisma.post.count()} 篇文章`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });