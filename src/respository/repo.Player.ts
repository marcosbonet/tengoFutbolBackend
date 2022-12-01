import mongoose from 'mongoose';
import { Player, PlayerTypes } from '../entities/players.js';
import { id } from '../inerfaces/repo.interfaces.js';

export class PlayerRepo {
    static instance: PlayerRepo;
    public static getInstance(): PlayerRepo {
        if (!PlayerRepo.instance) {
            PlayerRepo.instance = new PlayerRepo();
        }
        return PlayerRepo.instance;
    }
    async get(): Promise<Array<PlayerTypes>> {
        return Player.find().populate('matches', {
            id: 0,
            image: 0,
            player: 0,
        });
    }
    async getOne(id: id): Promise<PlayerTypes> {
        const result = await Player.findById(id).populate('matches', {
            id: 0,
            image: 0,
            player: 0,
        });
        return result as PlayerTypes;
    }
    async query(search: { [key: string]: string }): Promise<PlayerTypes> {
        const result = await Player.find(search).populate('matches', {
            id: 0,
            image: 0,
            player: 0,
        });

        return result as unknown as PlayerTypes;
    }
    async update(
        id: id,
        updateMatch: Partial<PlayerTypes>
    ): Promise<PlayerTypes> {
        const result = await Player.findByIdAndUpdate(id, updateMatch, {
            new: true,
        }).populate('matches', {
            id: 0,
            image: 0,
            player: 0,
        });
        if (!result) throw new Error('Not found id');
        return result as PlayerTypes;
    }

    async create(data: Partial<PlayerTypes>): Promise<PlayerTypes> {
        const result = await Player.create(data);
        return result as PlayerTypes;
    }

    async delete(id: id): Promise<id> {
        await Player.findByIdAndDelete(id);
        return id;
    }
    disconnect() {
        mongoose.disconnect();
    }
}
