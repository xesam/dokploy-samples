import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户列表失败' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { posts: true }
    });
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取用户失败' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, age } = req.body;
    if (!email || !name) {
      return res.status(400).json({ success: false, error: 'email 和 name 是必填项' });
    }
    const user = await prisma.user.create({
      data: { email, name, age }
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ success: false, error: '该邮箱已被使用' });
    }
    res.status(500).json({ success: false, error: '创建用户失败' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, age }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: '用户已删除' });
  } catch (error) {
    res.status(404).json({ success: false, error: '用户不存在' });
  }
});

export default router;