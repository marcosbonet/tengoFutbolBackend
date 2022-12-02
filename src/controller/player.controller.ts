import createDebug from 'debug';
import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';
import { HTTPError } from '../inerfaces/error.js';
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
            res.status(201).json({ player });
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

            if (!isPasswdValid) throw new Error('password invalid');
            const token = createToken({
                id: player.id.toString(),
                playerName: player.playerName,
            });
            console.log(token);
            res.json({ token });
        } catch (error) {
            next(error);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);
            res.json({ id: req.params.id });
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

    createHttpError(error: Error) {
        if ((error as Error).message === 'Not found id') {
            const httpError = new HTTPError(
                404,
                'Not Found',
                (error as Error).message
            );
            return httpError;
        }
    }
}
