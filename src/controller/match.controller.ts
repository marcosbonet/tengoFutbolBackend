import { NextFunction, Response, Request } from 'express';
import { Error } from 'mongoose';
import { MatchTypes } from '../entities/matches';
import { PlayerTypes } from '../entities/players';
import createDebug from 'debug';
import { HTTPError } from '../inerfaces/error';
import { MatchRepoTypes, PlayerRepoTypes } from '../inerfaces/repo.interfaces';
import { ExtraRequest } from '../middlewares/interceptor';

const debug = createDebug('PF:controller:matchcontroller');
export class MatchController {
    constructor(
        public matchRepo: MatchRepoTypes<MatchTypes>,
        public playerRepo: PlayerRepoTypes<PlayerTypes>
    ) {}

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
    //     async query(req: Request, res: Response, next: NextFunction)
    // {
    //     try{debug('query');
    // const match= await this.matchRepo.query(data)
    //     res.status(201).json({match})

    // }
    //   catch (error) {
    //             const httpError = new HTTPError(
    //                 503,
    //                 'Service unavailable',
    //                 (error as Error).message
    //             );
    //             next(httpError);
    //         }}

    // async post(req: ExtraRequest, res: Response, next: NextFunction) {
    //     try {
    //         debug('post');
    //         if (!req.payload) {
    //             throw new Error(' Invalid Payload');
    //         }
    //         const player = await this.playerRepo.getOne(req.payload.id);
    //         const match = await this.matchRepo.getOne(req.payload.id);
    //         req.body.players = player.id;
    //         req.body.matches = match.id;
    //         const match = await this.matchRepo.create(req.body);
    //         const player = await this.playerRepo.create(req.body);
    //         player.matches.push(match.id);
    //         this.playerRepo.update(player.id.toString(), {
    //             matches: player.matches,
    //         });
    //         match.players.push(player.id);
    //         this.matchRepo.update(match.id.toString(), {
    //             players: match.players,
    //         });

    //         res.status(201).json({ match });
    //     } catch (error) {
    //         const httpError = new HTTPError(
    //             503,
    //             'Service unavailable',
    //             (error as Error).message
    //         );
    //         next(httpError);
    //     }
    // }
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
        if ((error as Error).message === 'Not found id') {
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
            (error as Error).message
        );
        return httpError;
    }
}

//  [GETALL]/matches→ Devuelve un array con todos partidos.(home)
//  [SEARCH]/matches/get/:IDmatch→ Devuelve un partido particular, filtrado por fecha y lugar
//  [POST]/matches/create→ Recibe un objeto matches sin id para crearlo en la BD y devuelve el mismo objeto con id creada.
//  [PATCH]/matches/addplayer/:IDmatch → Recibe un partido , realiza las modificaciones generando un nuevo jugador en la BD con la misma id y la propiedad del matches destino, con un nuevo jugador
//  [PATCH]/matches/deleteplayer/:IDmatch → Recibe un partido , realiza las modificaciones generando  menus jugador en la BD con la misma id y la propiedad del matches destino, con un nuevo jugador
