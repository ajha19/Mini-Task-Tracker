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

        expect(res.statusCode).toEqual(200);
    });
});
