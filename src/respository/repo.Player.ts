import mongoose, { Types } from 'mongoose';
import { Player, PlayerTypes } from '../entities/players.js';
import { id } from '../inerfaces/repo.interfaces.js';
import { passwdEncrypt } from '../services/auth/auth.js';

export class PlayerRepo {
    static instance: PlayerRepo;
    public static getInstance(): PlayerRepo {
        if (!PlayerRepo.instance) {
            PlayerRepo.instance = new PlayerRepo();
        }
        return PlayerRepo.instance;
    }
    #Model = Player;
    async get(): Promise<Array<PlayerTypes>> {
        return Player.find();
    }
    async getOne(id: id): Promise<PlayerTypes> {
        const result = await this.#Model.findById(id).populate('matches');
        // .populate('matches', {
        //     id: 0,
        //     image: 0,
        // }
        return result as PlayerTypes;
    }
    async getWithoutPopulate(id: id): Promise<PlayerTypes> {
        const result = await this.#Model.findById(id);
        return result as PlayerTypes;
    }
    async query(key: string, value: string): Promise<PlayerTypes> {
        const result = await this.#Model
            .findOne({ [key]: value })
            .populate('matches');
        return result as unknown as PlayerTypes;
    }
    async update(
        id: id,
        updateMatch: Partial<PlayerTypes>
    ): Promise<PlayerTypes> {
        const result = await Player.findByIdAndUpdate(id, updateMatch, {
            new: true,
        });

        return result as PlayerTypes;
    }

    async create(data: Partial<PlayerTypes>): Promise<PlayerTypes> {
        data.password = await passwdEncrypt(data.password as string);

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
