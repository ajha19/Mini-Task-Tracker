import request from 'supertest';
import app from '../app';
import User from '../models/User';

// Mock Redis to avoid connection issues during tests
jest.mock('../config/redis', () => ({
    connect: jest.fn(),
    on: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
}));

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with existing email', async () => {
        await User.create({
            name: 'Existing User',
            email: 'test@example.com',
            password: 'password123',
        });

        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Test User 2',
                email: 'test@example.com', // Same email
                password: 'password123',
            });
        expect(res.statusCode).toEqual(400);
    });

    it('should login a user', async () => {
        await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Login User',
                email: 'login@example.com',
                password: 'password123',
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
