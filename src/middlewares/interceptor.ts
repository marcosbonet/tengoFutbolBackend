import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../inerfaces/error.js';
import { readToken } from '../services/auth/auth.js';
import { MatchRepo } from '../respository/repo.Match.js';
export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const autori = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const authString = req.get('Authorization');

    if (!authString || !authString?.startsWith('Bearer')) {
        next(new HTTPError(403, 'Forbidden', 'password or user are wrong'));
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(new HTTPError(403, 'Forbidden', 'password or user are wrong'));
    }
};
export const authen = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const repo = MatchRepo.getInstance();
    try {
        const match = await repo.getOne(req.params.id);
        if (match.players.toString() !== (req.payload as JwtPayload).id) {
            next(new HTTPError(403, 'Forbidden', 'password or user are wrong'));
        }
        next();
    } catch (error) {
        next(error);
    }
};
