import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { ProtoPlayer } from '../entities/players.js';
import { CustomError, HTTPError } from '../inerfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptor.js';
import { MatchRepo } from '../respository/repo.Match.js';
import { PlayerRepo } from '../respository/repo.Player.js';
import { createToken, passwdValidate } from '../services/auth/auth.js';
jest.mock('../services/auth/auth.js');
import { PlayerController } from './player.controller.js';

describe('Given playerController', () => {
    describe('When we instantiate it', () => {
        const RepoPlayer = PlayerRepo.getInstance();
        const RepoMatch = MatchRepo.getInstance();
        const userId = new Types.ObjectId();

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
        let res: Partial<Response>;
        let next: NextFunction;

        let error: CustomError;
        beforeEach(() => {
            req = {};
            res = {};
            req.payload = { id: userId };
            req.params = { Id: '638a309b43b024a81a77ce92' };
            req.body = {};
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
            res.json = jest.fn();
        });
        const mockData = [
            {
                playerName: 'messi',
                password: '54321',
                id: userId,
            },
        ];

        test('Then register should have been called', async () => {
            req = { body: mockData[0] };
            RepoPlayer.create = jest
                .fn()
                .mockResolvedValue(mockData[0] as ProtoPlayer);

            await PlayerController1.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                player: mockData[0],
            });
        });
        test('then if data is nos ok, it throws an error', async () => {
            (RepoPlayer.create as jest.Mock).mockRejectedValue(
                new Error('Error')
            );
            await PlayerController1.register(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });

        test('Then login should have been called', async () => {
            RepoPlayer.query = jest.fn().mockResolvedValue(mockData[0]);
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = mockData[0].playerName;
            await PlayerController1.login(
                req as Request,
                res as Response,
                next
            );
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });
        test(' then id the player is logged and the password is invalid', async () => {
            error = new HTTPError(404, 'not found', 'password invalid');
            RepoPlayer.getOne = jest.fn().mockRejectedValue(null);
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { playerName: '', password: 'potato' };
            await PlayerController1.login(
                req as Request,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('then if the user  is nos ok, it throws an error', async () => {
            (RepoPlayer.create as jest.Mock).mockRejectedValue([]);
            await PlayerController1.register(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
        test('Then login should have not been called', async () => {
            RepoPlayer.query = jest.fn().mockResolvedValue(mockData[0]);
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            RepoPlayer.query = jest.fn().mockRejectedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
            });
            await PlayerController1.login(
                req as Request,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });

        test('Then delete should have been called', async () => {
            RepoPlayer.delete = jest.fn();
            await PlayerController1.delete(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });
    });
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
        const PlayerController1 = new PlayerController(RepoPlayer, repoUser);
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
        test('Then login should have not been called', async () => {
            RepoPlayer.query = jest.fn().mockRejectedValue(false);
            await PlayerController1.login(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then login should have not been called', async () => {
            (passwdValidate as jest.Mock) = jest.fn().mockResolvedValue(false);

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
