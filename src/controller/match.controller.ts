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
    async query(req: Request, res: Response, next: NextFunction) {
        try {
            debug('query');

            const match = await this.matchRepo.query({ place: req.body.value });

            res.status(201);
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

    async create(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            debug('post');

            if (!req.payload) {
                throw new Error(' Invalid Payload');
            }

            const playerA = await this.playerRepo.getOne(req.payload.id);

            const matchA = await this.matchRepo.create(req.body);

            matchA.players.push(playerA.id);

            this.matchRepo.update(matchA.id.toString(), {
                players: matchA.players,
            });

            res.status(201);
            res.json({ playerA });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async updateAdd(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('the playeris already in this match');
            }
            const match = await this.matchRepo.getOne(req.params.id);

            const player = await this.playerRepo.getOne(req.payload.id);
            if (match.players.includes(player.id))
                match.players.push(player.id);
            const updateMatch = await this.matchRepo.update(
                match.id.toString(),
                { players: match.players }
            );

            res.status(200);
            res.json(updateMatch);
        } catch (error) {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async updatedelete(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) throw new Error('Wrong payload');
            const match = await this.matchRepo.getOne(req.params.id);
            debug(match);
            const player = await this.playerRepo.getOne(req.payload.id);
            debug(player);
            const filterDelete = match.players.filter(
                (ply) => ply.toString() !== player.id.toString()
            );

            const updateDelete = await this.matchRepo.update(
                match.id.toString(),
                {
                    players: filterDelete,
                }
            );

            res.json(updateDelete);
        } catch (error) {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            next(httpError);
        }
    }
}
