import request from 'supertest';
import app from '../app';
import User from '../models/User';
import redisClient from '../config/redis';

// Mock Redis
jest.mock('../config/redis', () => ({
    connect: jest.fn(),
    on: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
}));

describe('Task API', () => {
    let token: string;

    beforeEach(async () => {
        // specific user for task tests
        await request(app).post('/api/auth/signup').send({
            name: 'Task User',
            email: 'task@example.com',
            password: 'password123',
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'task@example.com',
                password: 'password123',
            });
        token = loginRes.body.token;
    });

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task',
                description: 'Task description',
                status: 'pending',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual('New Task');
    });

    it('should get all tasks', async () => {
        await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task 1' });

        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(1);
    });

    it('should delete a task', async () => {
        const createRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task to Delete' });

        const taskId = createRes.body._id;

        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`);

    });

    it('should return 404 if task not found', async () => {
        const res = await request(app)
            .delete(`/api/tasks/60d5ec49f1b2c8211c123456`) // Random ObjectId
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
    });

    it('should return 401 if user is not authorized to delete task', async () => {
        // Create a task with the first user
        const createRes = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task for User 1' });

        const taskId = createRes.body._id;

        // Create a second user
        await request(app).post('/api/auth/signup').send({
            name: 'User 2',
            email: 'user2@example.com',
            password: 'password123',
        });

        const loginRes2 = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user2@example.com',
                password: 'password123',
            });

        const token2 = loginRes2.body.token;

        // Try to delete the task with the second user
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token2}`);

        expect(res.statusCode).toEqual(401);
    });
});
