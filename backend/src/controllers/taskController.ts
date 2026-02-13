import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';
import redisClient from '../config/redis';

// Helper to get cache key
const getCacheKey = (userId: string) => `tasks:${userId}`;

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = (req.user?._id as unknown) as string;
        const cacheKey = getCacheKey(userId);

        // Try to fetch from Redis
        const cachedTasks = await redisClient.get(cacheKey);

        if (cachedTasks) {
            res.json(JSON.parse(cachedTasks));
            return;
        }

        // If not in cache, fetch from DB
        // Cast userId to any to bypass strict ObjectId check
        const tasks = await Task.find({ owner: userId as any }).sort({ createdAt: -1 });

        // Store in Redis (expire in 1 hour)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, dueDate } = req.body;

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            owner: req.user?._id,
        });

        const createdTask = await task.save();

        // Invalidate Cache
        const userId = (req.user?._id as unknown) as string;
        await redisClient.del(getCacheKey(userId));

        res.status(201).json(createdTask);
    } catch (error) {
        res.status(400).json({ message: 'Invalid task data' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        if (task.owner.toString() !== (req.user?._id as unknown as string).toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        task.dueDate = req.body.dueDate || task.dueDate;

        const updatedTask = await task.save();

        // Invalidate Cache
        const userId = (req.user?._id as unknown) as string;
        await redisClient.del(getCacheKey(userId));

        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: 'Invalid task data' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        if (task.owner.toString() !== (req.user?._id as unknown as string).toString()) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        await Task.deleteOne({ _id: task._id });

        // Invalidate Cache
        const userId = (req.user?._id as unknown) as string;
        await redisClient.del(getCacheKey(userId));

        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getTasks, createTask, updateTask, deleteTask };
