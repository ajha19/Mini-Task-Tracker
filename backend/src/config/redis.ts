import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

(async () => {
    if (process.env.NODE_ENV !== 'test') { // Prevent connection during tests if mocking
        await redisClient.connect();
    }
})();

export default redisClient;
