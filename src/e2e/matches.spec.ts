import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../services/db.connect/db.connect';

describe('Given an "app" with "/matches" route', () => {
    describe('When I have connection to mongoDB', () => {
        beforeEach(async () => {
            await dbConnect();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url/should sent status 200', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        });

        test('Then the get to url /matches/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get(
                '/matches/638a1e0e2c7264486c478a33'
            );
            expect(response.status).toBe(404);
        });
        test('Then the get to url /:key/:value with  params should sent status 200', async () => {
            const response = await request(app).get('/matches/places/camp_nou');
            expect(response.status).toBe(200);
        });
    });
});
