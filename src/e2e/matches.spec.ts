import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { dbConnect } from '../services/db.connect/db.connect';
import { Player } from '../entities/players';
import { Match } from '../entities/matches';
import { createToken, TokenPayload } from '../services/auth/auth';

describe('Given an "app" with "/matches" route', () => {
    const setPlayer = async () => {
        const mockPlayer = [
            {
                playerName: 'RobertoCarlo',
                password: '76543',
            },
            {
                playerName: 'Robiño',
                password: '7654',
            },
        ];
        await Player.deleteMany();
        await Player.insertMany(mockPlayer);
        const dataPlayer = await Player.find();
        const playerIds = [dataPlayer[0].id, dataPlayer[1].id];
        return playerIds;
    };
    let pIds: Array<string>;

    const setMatch = async () => {
        const mockMatch = [
            {
                places: 'Quilmes',
            },
            {
                places: 'Peñarol',
            },
        ];
        await Match.deleteMany();
        await Match.insertMany(mockMatch);
        const dataMatch = await Match.find();
        const playerIds = [dataMatch[0].id, dataMatch[1].id];
        return playerIds;
    };
    let token: string;
    let mIds: Array<string>;

    describe('When I have connection to mongoDB', () => {
        beforeEach(async () => {
            await dbConnect();
            mIds = await setMatch();
            pIds = await setPlayer();
            const payload: TokenPayload = {
                id: pIds[0],
                playerName: 'Dimaria',
            };
            token = createToken(payload);
        });
        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url / with invalid id should sent status 200', async () => {
            const response = await request(app).get('/matches/');
            expect(response.status).toBe(200);
        });
        test('If the  is invalid, it should send a status 404', async () => {
            await request(app).get('/matches/.').expect(404);
        });
        describe(' given the /:key/:value route', () => {
            test('Then it should send a status 201', async () => {
                await request(app)
                    .search(`/matches/search/places/Quilmes`)
                    .expect(201);
            });

            test('If the path is invalid, it should send a status 404', async () => {
                await request(app).search('/matches/search/manolo').expect(404);
            });
        });
        describe('When we use patch to the url /matches/update/:id', () => {
            test('Then it should send a status 200', async () => {
                const response = await request(app)
                    .patch(`/matches/update/${mIds[0]}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });

            test('If the token is invalid, it should send a status 403', async () => {
                const response = await request(app)
                    .patch(`/matches/update/${mIds[0]}`)
                    .set('Authorization', `Bearer `);
                expect(response.status).toBe(403);
            });

            test('If the id is invalid, it should send a status 404', async () => {
                const response = await request(app)
                    .patch(`/matches/update/${mIds[8]}`)
                    .set('Authorization', `Bearer ${token} `);
                expect(response.status).toBe(404);
            });
        });
        describe('If we use the post to the url /matches/', () => {
            test('When we un the post , then is should be send a status 201', async () => {
                const response = await request(app)
                    .post('/matches/')

                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        places: 'Colon de Santa fe',
                    });
                expect(response.status).toBe(201);
            });
        });
        describe('When we use patch to the url /matches/delete/:id', () => {
            test('Then it should send a status 200', async () => {
                const response = await request(app)
                    .patch(`/matches/delete/${mIds[0]}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });

            test('If the token is invalid, it should send a status 403', async () => {
                const response = await request(app)
                    .patch(`/matches/delete/${mIds[0]}`)
                    .set('Authorization', `Bearer `);
                expect(response.status).toBe(403);
            });

            test('If the id is invalid, it should send a status 404', async () => {
                const response = await request(app)
                    .patch(`/matches/delete/${mIds[8]}`)
                    .set('Authorization', `Bearer ${token} `);
                expect(response.status).toBe(404);
            });
        });
    });
});
