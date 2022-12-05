import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../inerfaces/error';
import { ExtraRequest } from '../middlewares/interceptor';
import { MatchRepo } from '../respository/repo.Match';
import { PlayerRepo } from '../respository/repo.Player';
import { MatchController } from './match.controller';

describe('given the controller match', () => {
    let error: CustomError;

    describe('when we intantantiate it', () => {
        const repoMatch = MatchRepo.getInstance();
        const repoPlayer = PlayerRepo.getInstance();
        const controllerMatch = new MatchController(repoMatch, repoPlayer);
        const id = new Types.ObjectId();

        repoMatch.create = jest.fn().mockResolvedValue({
            id: '0',
            place: 'Vlelez',
            players: [id],
        });
        repoMatch.query = jest.fn().mockResolvedValue({
            id: '1',
            place: 'Racing',
            players: [id],
        });
        repoMatch.get = jest.fn().mockResolvedValue([
            {
                id: '2',
                place: 'la plata',
                players: [id],
            },
        ]);
        repoMatch.getOne = jest.fn().mockResolvedValue({
            id: '3',
            place: 'river',
            players: [id],
        });

        repoMatch.update = jest.fn().mockResolvedValue([
            {
                id: '4',
                place: 'boca',
                players: [id],
            },
        ]);

        const req: Partial<Request> = {};
        const res: Partial<Response> = { json: jest.fn() };
        const next: NextFunction = jest.fn();
        const mockMatchArray = { match: ['match'] };
        const mockMatch = {
            id: '6389e8f18a40fefcfdc07085',
            places: 'camp nou',
            date: '2011-09',
            image: 'buenaso',
            players: [''],
        };

        test(' then the method GET will return a array of match ..', async () => {
            repoMatch.get = jest.fn().mockResolvedValue(['match']);
            await controllerMatch.get(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith({ match: ['match'] });
        });
        test(' if the get not receiv a array ..', async () => {
            error = new HTTPError(503, 'Serrvice Unavailable', ' very bad');
            repoMatch.get = jest.fn().mockRejectedValue(['match']);
            await controllerMatch.get(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(Error);
        });

        test('then QUERY will return a  array of match filter by place', async () => {
            repoMatch.query = jest.fn().mockResolvedValue(mockMatch);
            req.params = { id: '6389e8f18a40fefcfdc07085' };
            await controllerMatch.query(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockMatchArray);
        });
        test('then when we intanciate a QUERY funciton', async () => {
            await controllerMatch.query(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalledWith(mockMatchArray);
        });
        test('then when we intanciate a QUERY funciton', async () => {
            await controllerMatch.query(req as Request, res as Response, next);
            req.body = { place: 'camp nou' };
            expect(res.json).toHaveBeenCalledWith(mockMatchArray);
        });

        test('Then QUERY should return an error', async () => {
            const error = new Error('not found ID');
            req.params = { id: '0' };
            repoMatch.getOne = jest.fn().mockRejectedValue(mockMatch);

            await controllerMatch.query(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test(' if the get not receiv a array ..', async () => {
            error = new HTTPError(503, 'Serrvice Unavailable', ' very bad');
            repoMatch.get = jest.fn().mockRejectedValue(['match']);
            await controllerMatch.create(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(Error);
        });
        test('Then CREATE should have been called', async () => {
            repoPlayer.getOne = jest.fn().mockResolvedValue({
                id: '3',
                playerName: 'dybala',
                matches: [],
            });
            repoMatch.getOne = jest.fn().mockResolvedValue({
                id: '4',
                playerName: 'la Romareda',
                players: [],
            });
            repoMatch.create = jest.fn().mockResolvedValue({
                id: '5',
                place: 'Vlelez',
            });
            repoMatch.update = jest.fn().mockResolvedValue(mockMatch);

            const req = { payload: {}, body: {} };
            await controllerMatch.create(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });

        // test('It should return one place', async () => {
        //     (req as ExtraRequest).payload = { id: '' };
        //     req.body = {};

        //     await controllerMatch.create(
        //         req as ExtraRequest,
        //         res as Response,
        //         next
        //     );
        //     const mockPlayer1 = {
        //         id: '1a',
        //         playerName: 'Sergio rodrigues',
        //     };
        //     const mockMatchArray1 = {
        //         match: [ 'match' ],
        //     };

        //     await repoPlayer.getOne(mockPlayer1.id);
        //     await repoMatch.create(mockMatchArray1.match[]);

        //     expect(res.json).toHaveBeenCalledWith(mockMatchArray1);
        // });
    });
});
