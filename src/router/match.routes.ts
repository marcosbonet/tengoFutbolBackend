import { Router } from 'express';
import { MatchController } from '../controller/match.controller.js';
import { autori } from '../middlewares/interceptor.js';
import { MatchRepo } from '../respository/repo.Match.js';
import { PlayerRepo } from '../respository/repo.Player.js';

export const matchesRouter = Router();
const controller = new MatchController(
    MatchRepo.getInstance(),
    PlayerRepo.getInstance()
);

matchesRouter.get('/', controller.get.bind(controller));
matchesRouter.search('/search/:key/:value', controller.query.bind(controller));
matchesRouter.post('/', autori, controller.create.bind(controller));
matchesRouter.patch(
    '/update/:id',
    autori,

    controller.updateAdd.bind(controller)
);
matchesRouter.patch(
    '/delete/:id',
    autori,
    controller.updatedelete.bind(controller)
);
