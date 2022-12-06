import mongoose from 'mongoose';
import { Match, MatchTypes, ProtoMatch } from '../entities/matches.js';
import { Player } from '../entities/players.js';

export type id = string;
export class MatchRepo {
    static instance: MatchRepo;
    public static getInstance(): MatchRepo {
        if (!MatchRepo.instance) {
            MatchRepo.instance = new MatchRepo();
        }
        return MatchRepo.instance;
    }
    #Match = Match;
    async get(): Promise<Array<MatchTypes>> {
        const matches = this.#Match.find();
        return matches;
    }
    async getOne(id: id): Promise<MatchTypes> {
        const result = await Match.findById(id).populate('players', {
            id: 0,
            image: 0,
        });
        return result as MatchTypes;
    }
    async update(
        id: id,
        updateMatch: Partial<MatchTypes>
    ): Promise<MatchTypes> {
        const result = await this.#Match.findByIdAndUpdate(id, updateMatch, {
            new: true,
        });

        return result as MatchTypes;
    }
    async query(search: { [key: string]: string }): Promise<MatchTypes> {
        const result = Match.find(search).populate('players', {
            email: 0,
            password: 0,
        });

        return result as unknown as MatchTypes;
    }
    async create(data: ProtoMatch): Promise<MatchTypes> {
        const result = await (
            await Match.create(data)
        ).populate('players', {
            email: 0,
            password: 0,
        });
        return result as MatchTypes;
    }
    async delete(id: id): Promise<id> {
        Player.findByIdAndDelete(id);
        return id;
    }
    disconnect() {
        mongoose.disconnect();
    }
}
