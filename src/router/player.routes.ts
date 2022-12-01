import { Router } from 'express';
import { PlayerController } from '../controller/player.controller.js';
import { MatchRepo } from '../respository/repo.Match.js';
import { PlayerRepo } from '../respository/repo.Player.js';

export const playerRouter = Router();
const controller = new PlayerController(
    PlayerRepo.getInstance(),
    MatchRepo.getInstance()
);

playerRouter.post('/register', controller.register.bind(controller));
playerRouter.post('/login', controller.login.bind(controller));
playerRouter.delete('/:id', controller.delete.bind(controller));
