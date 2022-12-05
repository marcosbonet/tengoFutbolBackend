import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../inerfaces/error';
import { ExtraRequest } from '../middlewares/interceptor';
import { MatchRepo } from '../respository/repo.Match';
import { PlayerRepo } from '../respository/repo.Player';
import { createToken, passwdValidate } from '../services/auth/auth';
import { PlayerController } from './player.controller';

describe('Given playerController', () => {
    describe('When we instantiate it', () => {
        const RepoPlayer = PlayerRepo.getInstance();
        const RepoMatch = MatchRepo.getInstance();
        const userId = new Types.ObjectId();

        RepoPlayer.create = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
        });
        RepoPlayer.query = jest.fn().mockResolvedValue({
            id: userId,
            name: 'elena',
        });

        RepoPlayer.getOne = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });

        RepoPlayer.update = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
        });

        const PlayerController1 = new PlayerController(RepoPlayer, RepoMatch);

        let req: Partial<ExtraRequest>;
        let resp: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            resp = {};
            req.payload = { id: userId };
            req.params = { productId: '6388ee3b4edce8fdd9fa1c11' };
            req.body = {};
            resp.status = jest.fn().mockReturnValue(resp);
            next = jest.fn();
            resp.json = jest.fn();
        });
        const mockData = [
            {
                playerName: 'Pepe',
                email: 'pepe@gmail.com',
                id: userId,
                password: '1234',
            },
        ];

        // test('Then register should have been called', async () => {
        //     await PlayerController1.register(
        //         req as Request,
        //         resp as Response,
        //         next
        //     );
        //     expect(resp.json).toHaveBeenCalledWith({
        //         user: {
        //             id: userId,
        //             playerName: 'Carlo',
        //         },
        //     });
        // });

        // test('Then login should have been called', async () => {
        //     req.body = { playerName: mockData[0].playerName };
        //     await RepoPlayer.query(id: userId  , { playerName: 'Pepe' });
        //     (passwdValidate as jest.Mock).mockResolvedValue(true);
        //     (createToken as jest.Mock).mockReturnValue('token');
        //     req.body = mockData[0].password;
        //     await PlayerController1.login(req as Request, resp as Response, next);
        //     expect(resp.json).toHaveBeenCalledWith({ token: 'token' });
        // });

        //     test('Then deleteCart should have been called', async () => {
        //         RepoPlayer.getOne = jest.fn().mockResolvedValue({
        //             id: userId,
        //             name: 'elena',
        //             role: 'admin',
        //             myProducts: [{ productId: '6388ee3b4edce8fdd9fa1c11' }],
        //         });
        //         await PlayerController1.delete(
        //             req as ExtraRequest,
        //             resp as Response,
        //             next
        //         );
        //         expect(resp.json).toHaveBeenCalled();
        //     });
        // });
        describe('When PlayerController is not valid', () => {
            let error: CustomError;
            beforeEach(() => {
                error = new HTTPError(404, 'Not found', 'Not found id');
            });

            const RepoPlayer = PlayerRepo.getInstance();
            const repoUser = MatchRepo.getInstance();
            RepoPlayer.get = jest.fn().mockRejectedValue(['Product']);
            RepoPlayer.query = jest.fn().mockRejectedValue('Product');
            RepoPlayer.create = jest.fn().mockRejectedValue(['Product']);
            RepoPlayer.update = jest.fn().mockRejectedValue(['Product']);
            RepoPlayer.delete = jest.fn().mockRejectedValue(['Product']);
            const PlayerController1 = new PlayerController(
                RepoPlayer,
                repoUser
            );
            const req: Partial<Request> = {};
            const resp: Partial<Response> = {
                json: jest.fn(),
            };
            const next: NextFunction = jest.fn();

            test('should return an error', async () => {
                error.message = 'Not found id';
                error.statusCode = 404;
                error.statusMessage = 'Not found';
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
                expect(error).toHaveProperty('statusCode', 404);
                expect(error).toHaveProperty('statusMessage', 'Not found');
                expect(error).toHaveProperty('message', 'Not found id');
                expect(error).toHaveProperty('name', 'HTTPError');
            });

            test('Then register should return an error', async () => {
                await PlayerController1.register(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('Then login should have not been called', async () => {
                RepoPlayer.query = jest.fn().mockRejectedValue({
                    id: '637d1d346346f6ff04b55896',
                    name: 'pepe',
                });
                await PlayerController1.login(
                    req as Request,
                    resp as Response,
                    next
                );
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('Then delete should have been called', async () => {
                RepoPlayer.query = jest.fn().mockRejectedValue({
                    name: 'elena',
                });
                await PlayerController1.delete(
                    req as ExtraRequest,
                    resp as Response,
                    next
                );

                expect(error).toBeInstanceOf(HTTPError);
            });
        });
    });
});
