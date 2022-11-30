import mongoose, { Types } from 'mongoose';
import { Player, PlayerTypes } from '../entities/players';

export type id = Types.ObjectId;
export class PlayerRepo {
    static instance: PlayerRepo;
    public static getInstance(): PlayerRepo {
        if (!PlayerRepo.instance) {
            PlayerRepo.instance = new PlayerRepo();
        }
        return PlayerRepo.instance;
    }
    async get(): Promise<Array<PlayerTypes>> {
        return Player.find();
    }
    async find(search: { [key: string]: string }): Promise<PlayerTypes> {
        const result = await Player.find(search);

        return result as unknown as PlayerTypes;
    }

    async post(data: PlayerTypes): Promise<PlayerTypes> {
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
