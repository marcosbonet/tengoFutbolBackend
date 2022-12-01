import { NextFunction, Response, Request } from 'express';
import { Error, ObjectId } from 'mongoose';
import { MatchTypes } from '../entities/matches';
import { PlayerTypes } from '../entities/players';
import { HTTPError } from '../inerfaces/error';
import { MatchRepoTypes, PlayerRepoTypes } from '../inerfaces/repo.interfaces';
import { createToken, passwdValidate } from '../services/auth/auth';

export class PlayerController {
    constructor(
        public repository: PlayerRepoTypes<PlayerTypes>,
        public matchRepo: MatchRepoTypes<MatchTypes>
    ) {}

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
            const player = await this.repository.query({
                playerName: req.body.playerName,
            });
            player.id.toString;
            const isPasswdValid = await passwdValidate(
                req.body.password,
                player.password
            );
            if (!isPasswdValid) throw new Error('password invalid');
            const token = createToken({
                id: player.id,
                playerName: player.playerName,
            });

            res.json({ token });
        } catch (error) {
            next(this.createHttpError(error as Error));
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
