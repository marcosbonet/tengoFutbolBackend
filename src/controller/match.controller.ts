import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';
import createDebug from 'debug';
import { HTTPError } from '../inerfaces/error.js';

import { ExtraRequest } from '../middlewares/interceptor.js';
import { PlayerRepo } from '../respository/repo.Player.js';
import { MatchRepo } from '../respository/repo.Match.js';

const debug = createDebug('PF:controller:match.controller');
export class MatchController {
    constructor(public matchRepo: MatchRepo, public playerRepo: PlayerRepo) {}

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const match = await this.matchRepo.get();
            res.json({ match });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async queryPlace(req: Request, res: Response, next: NextFunction) {
        try {
            debug('query');

            const match = await this.matchRepo.query({ place: req.body.place });
            res.status(201).json({ match });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async queryDate(req: Request, res: Response, next: NextFunction) {
        try {
            debug('query');

            const match = await this.matchRepo.query({ date: req.body.date });
            res.status(201).json({ match });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async create(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error(' Invalid Payload');
            }

            const playerA = await this.playerRepo.getOne(req.payload.id);

            req.body.players = playerA.id;

            const matchA = await this.matchRepo.create(req.body);

            playerA.matches.push(matchA.id);

            this.playerRepo.update(playerA.id.toString(), {
                matches: playerA.matches,
            });
            res.status(201);
            res.json(matchA);
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const match = await this.matchRepo.update(req.params.id, req.body);
            res.json({ match });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async updatedelete(req: Request, res: Response, next: NextFunction) {
        try {
            const match = await this.matchRepo.delete(req.params.id);
            res.json({ match });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
