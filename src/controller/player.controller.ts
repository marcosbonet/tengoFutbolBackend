import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { Error, Types } from 'mongoose';
import { HTTPError } from '../inerfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptor.js';
import { MatchRepo } from '../respository/repo.Match.js';
import { PlayerRepo } from '../respository/repo.Player.js';
import { createToken, passwdValidate } from '../services/auth/auth.js';
const debug = createDebug('FP:player:controller');

export class PlayerController {
    constructor(public repository: PlayerRepo, public matchRepo: MatchRepo) {
        debug('controller');
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const player = await this.repository.create(req.body);

            res.status(201);

            res.json({ player });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Services Unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            debug('login');
            const player = await this.repository.query(
                'playerName',
                req.body.playerName
            );

            const isPasswdValid = await passwdValidate(
                req.body.password,
                player.password
            );
            if (!isPasswdValid) {
                throw new Error('password invalid');
            }
            const token = createToken({
                id: player.id.toString(),
                playerName: player.playerName,
            });
            res.status(202);

            res.json({ token, player });
        } catch (error) {
            next(error);
        }
    }
    async updateAdd(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('the playeris already in this match');
            }
            const player = await this.repository.getOne(req.payload.id);

            if (player.matches.includes(req.params.id)) {
                throw new Error('this player is already in this match');
            }

            player.matches.push(req.params.id);

            const updateAddPlayer = await this.repository.update(
                player.id.toString(),
                { matches: player.matches }
            );

            res.status(200);
            res.json(updateAddPlayer);
        } catch (error) {
            const httpError = new HTTPError(404, 'Not Found', 'Not found id');
            next(httpError);
        }
    }
    async updateDelete(req: ExtraRequest, res: Response, next: NextFunction) {
        try {
            if (!req.payload) {
                throw new Error('the playeris already in this match');
            }
            // const match = await this.matchRepo.getOne(req.params.id);

            const player = await this.repository.getOne(req.payload.id);

            if (player.matches.includes(req.params.id)) {
                throw new Error('this player is already in this match');
            }

            player.matches.filter((match) => {
                return match !== req.params.id;
            });

            const updateDeletePlayer = await this.repository.update(
                player.id.toString(),
                { matches: player.matches }
            );

            res.status(200);
            res.json(updateDeletePlayer);
        } catch (error) {
            const httpError = new HTTPError(404, 'Not Found', 'Not found id');
            next(httpError);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);

            res.json({ id: req.body.id });
        } catch (error) {
            (error as Error).message === 'Not found id';
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            next(httpError);
        }
    }
}
