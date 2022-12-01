import { Router } from 'express';
import { MatchController } from '../controller/match.controller.js';
import { MatchRepo } from '../respository/repo.Match.js';
import { PlayerRepo } from '../respository/repo.Player.js';

export const matchesRouter = Router();
const controller = new MatchController(
    MatchRepo.getInstance(),
    PlayerRepo.getInstance()
);

matchesRouter.get('/', controller.get.bind(controller));
matchesRouter.search(
    '/place/:key/:value',
    controller.queryPlace.bind(controller)
);
matchesRouter.search(
    '/date/:key/:value',
    controller.queryDate.bind(controller)
);
matchesRouter.post('/', controller.create.bind(controller));
matchesRouter.patch('/update/:id', controller.update.bind(controller));
matchesRouter.patch('/delete/:id', controller.updatedelete.bind(controller));
