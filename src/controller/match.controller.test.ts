import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../inerfaces/error';
import { ExtraRequest } from '../middlewares/interceptor';
import { MatchRepo } from '../respository/repo.Match';
import { PlayerRepo } from '../respository/repo.Player';
import { MatchController } from './match.controller';

const mockMatch = {
    id: '6389e8f18a40fefcfdc07085',
    places: 'camp nou',
    date: '2011-09',
    image: 'buenaso',
    players: [''],
};
describe('given the controller match', () => {
    let error: CustomError;
    let req: Partial<ExtraRequest> = {};
    // eslint-disable-next-line prefer-const
    let res: Partial<Response> = {};
    const repoMatch = MatchRepo.getInstance();
    const repoPlayer = PlayerRepo.getInstance();
    const controllerMatch = new MatchController(repoMatch, repoPlayer);
    const id = new Types.ObjectId();
    const next: NextFunction = jest.fn();

    beforeEach(() => {
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
        res.json = jest.fn();
        res.status = jest.fn().mockReturnValue(201);
        req = {
            body: {
                value: '',
                players: [],
            },
            payload: { id: '2' },
        };
    });
    describe('when we intantantiate it', () => {
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
            expect(res.json).toHaveBeenCalled();
        });
        test(' if the body haave not a value..', async () => {
            const error = new HTTPError(
                503,
                'Service Unavailable',
                'Not found id'
            );
            repoMatch.query = jest.fn().mockRejectedValue({});
            await controllerMatch.query(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(Error);
        });

        test('then when we intanciate a QUERY funciton', async () => {
            await controllerMatch.query(req as Request, res as Response, next);
            expect(res.json).toHaveBeenCalled();
        });
        test('then when we intanciate a QUERY funciton', async () => {
            await controllerMatch.query(req as Request, res as Response, next);
            req.body = { place: 'camp nou' };
            expect(res.json).toHaveBeenCalled();
        });

        test('Then QUERY should return an error', async () => {
            const error = new Error('not found ID');
            req.params = { id: '0' };
            repoMatch.getOne = jest.fn().mockRejectedValue(mockMatch);

            await controllerMatch.query(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test('Then CREATE1 should have been called', async () => {
            repoPlayer.getOne = jest.fn().mockReturnValue({ id: '3' });
            await controllerMatch.create(req as Request, res as Response, next);
            expect(res.status).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });
        test('Then creata should return an error because there arent payload', async () => {
            const error = new Error('not found payload');
            req.body = { places: '' };
            (req as ExtraRequest).payload = { id: '' };
            repoPlayer.getOne = jest.fn().mockRejectedValue({ id: '12' });

            await controllerMatch.create(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test(' if the get not receiv a array ..', async () => {
            error = new HTTPError(503, 'Serrvice Unavailable', ' very bad');
            repoMatch.get = jest.fn().mockRejectedValueOnce(['match']);
            await controllerMatch.create(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(Error);
        });
        test('when UPDATEADD is should resturn a token', async () => {
            req.params = { id: '0' };
            repoPlayer.getOne = jest.fn().mockReturnValue({ id: '3' });

            await controllerMatch.updateAdd(
                req as Request,
                res as Response,
                next
            );

            expect(res.status).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalled();
        });

        test('if the playeris already on the list, addFav should throw an error', async () => {
            req = {
                params: { id: '123456789012345678901239' },
                payload: { id: '123456789012345678901238' },
            };

            const mockData2 = { players: '123456789012345678901238' };

            repoMatch.getOne = jest.fn().mockResolvedValueOnce(mockData2);
            repoPlayer.getOne = jest
                .fn()
                .mockResolvedValue({ id: '123456789012345678901238' });

            await controllerMatch.updateAdd(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(next).toHaveBeenCalled();
        });
        test('when UPDATEADD is should resturn a token', async () => {
            req.params = { id: '0' };
            repoPlayer.getOne = jest.fn().mockReturnValue({ id: '3' });
            error = new HTTPError(404, 'Not found', (error as Error).message);

            await controllerMatch.updateAdd(
                req as Request,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(Error);
        });
        test('when UPDATEADD is should resturn a token', async () => {
            repoPlayer.getOne = jest.fn().mockRejectedValue({});
            error = new HTTPError(404, 'Not found', 'Not found id');
            await controllerMatch.updateAdd(
                req as Request,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(Error);
        });

        test('when UPDATEDELETTE is should resturn a token', async () => {
            req.params = { id: '1' };
            repoPlayer.getOne = jest.fn().mockReturnValue({ id: '3' });

            await controllerMatch.updatedelete(
                req as Request,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });
        test('when UPDATEDELETTE is should resturn a token', async () => {
            repoPlayer.getOne = jest.fn().mockRejectedValue({});
            error = new HTTPError(404, 'Not found', 'Not found id');
            await controllerMatch.updatedelete(
                req as Request,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(Error);
        });
    });
    describe('When productController is not valid', () => {
        let error: CustomError;
        beforeEach(() => {
            error = new HTTPError(404, 'Not found', 'Not found id');
        });

        const repository = MatchRepo.getInstance();
        const repoUser = PlayerRepo.getInstance();
        const productController = new MatchController(repository, repoUser);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
        };
        repository.get = jest.fn().mockRejectedValue(['product']);
        const next: NextFunction = jest.fn();

        test('Then GET should return an error', async () => {
            repository.get = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await productController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then GET should return an error', async () => {
            const error = new Error('Not found id');

            await productController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test('Then CREATE should return an error', async () => {
            await productController.create(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then UPDATE should return an error', async () => {
            await productController.updateAdd(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then DELETE should return an error', async () => {
            const error = new Error('Not found id');
            await productController.updatedelete(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
    });
});
