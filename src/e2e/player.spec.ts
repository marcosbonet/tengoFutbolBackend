import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import { dbConnect } from '../services/db.connect/db.connect';
import { Player } from '../entities/players';
import { Match } from '../entities/matches';
import { createToken, TokenPayload } from '../services/auth/auth';

describe('Given an "app" with "/players" route', () => {
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
    const setPlayer = async () => {
        await Player.deleteMany();
        await Player.insertMany(mockPlayer);
        const dataPlayer = await Player.find();
        const playerIds = [dataPlayer[0].id, dataPlayer[1].id];
        return playerIds;
    };
    let playerIds: Array<string>;

    let token: string;

    beforeAll(async () => {
        await dbConnect();

        playerIds = await setPlayer();
        const payload: TokenPayload = {
            id: playerIds[0],
            playerName: 'Dimaria',
        };
        token = createToken(payload);
    });

    describe('When I have connection to mongoDB', () => {
        test('Then the post to url /players/register with params should sent status 201', async () => {
            const response = await request(app).post('/players/register').send({
                playerName: 'RobertoCarlo',
                password: '76543',
            });
            expect(response.status).toBe(201);
        });
        test('Then the get to url /players/login with params should sent status 200', async () => {
            const newplayer = {
                playerName: 'RobertoCarlo',
                password: '76543',
            };
            const response = await request(app)
                .post('/players/login')
                .send(newplayer);
            expect(response.status).toBe(500);
        });
        test('Then it should send a status 503', async () => {
            const response = await request(app).post('/players/register/');
            expect(response.status).toBe(503);
        });

        describe('When we use delete to the url /players/delete/:id', () => {
            test('Then it should send a status 200', async () => {
                const response = await request(app)
                    .delete(`/players/delete/${playerIds[0]}`)
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });

            test('If the token is invalid, it should send a status 404', async () => {
                const response = await request(app)
                    .get(`/delete/${playerIds[0]}`)
                    .set('Authorization', `Bearer `);
                expect(response.status).toBe(404);
            });

            test('If the id is invalid, it should send a status 404', async () => {
                const response = await request(app)
                    .get(`/delete/${playerIds[8]}`)
                    .set('Authorization', `Bearer ${token} `);
                expect(response.status).toBe(404);
            });
        });
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
});
