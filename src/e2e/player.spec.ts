import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { dbConnect } from '../services/db.connect/db.connect';

describe('Given an "app" with "/users" route', () => {
    describe('When I have connection to mongoDB', () => {
        beforeEach(async () => {
            await dbConnect();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url /players/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get(
                '/players/6388a756ea85b251c768e221'
            );
            expect(response.status).toBe(404);
        });
        test('Then the get to url /players/register with params should sent status 503', async () => {
            const response = await request(app).post('/players/register');
            expect(response.status).toBe(503);
        });
        test('Then the get to url /players/login with params should sent status 503', async () => {
            const response = await request(app).post('/players/login');
            expect(response.status).toBe(500);
        });
        test('Then the get to url /players/:id with params should sent status 500', async () => {
            const response = await request(app).post(
                '/players/6388a756ea85b251c768e221'
            );
            expect(response.status).toBe(404);
        });
    });
});
