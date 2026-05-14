import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    const where = published !== undefined ? { published: published === 'true' } : {};
    const posts = await prisma.post.findMany({
      where,
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取文章列表失败' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true }
    });
    if (!post) {
      return res.status(404).json({ success: false, error: '文章不存在' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取文章失败' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content, authorId } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({ success: false, error: 'title 和 authorId 是必填项' });
    }
    const post = await prisma.post.create({
      data: { title, content, authorId },
      include: { author: { select: { name: true } } }
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: '创建文章失败' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, published }
    });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(404).json({ success: false, error: '文章不存在' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: '文章已删除' });
  } catch (error) {
    res.status(404).json({ success: false, error: '文章不存在' });
  }
});

export default router;