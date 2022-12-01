import mongoose, { Types } from 'mongoose';
import { Match, MatchTypes } from '../entities/matches';
import { Player } from '../entities/players';

export type id = Types.ObjectId;
export class MatchRepo {
    static instance: MatchRepo;
    public static getInstance(): MatchRepo {
        if (!MatchRepo.instance) {
            MatchRepo.instance = new MatchRepo();
        }
        return MatchRepo.instance;
    }
    async get(): Promise<Array<MatchTypes>> {
        return Match.find().populate('players', {
            email: 0,
            password: 0,
        });
    }
    async getoOne(id: id): Promise<MatchTypes> {
        const result = await Match.findById(id).populate('matches', {
            id: 0,
            image: 0,
            player: 0,
        });
        return result as MatchTypes;
    }
    async update(
        id: id,
        updateMatch: Partial<MatchTypes>
    ): Promise<MatchTypes> {
        const result = await Match.findByIdAndUpdate(id, updateMatch, {
            new: true,
        }).populate('players', {
            email: 0,
            password: 0,
        });
        if (!result) throw new Error('Not found id');
        return result as MatchTypes;
    }
    async query(search: { [key: string]: string }): Promise<MatchTypes> {
        const result = await Match.find(search).populate('players', {
            email: 0,
            password: 0,
        });

        return result as unknown as MatchTypes;
    }
    async create(data: MatchTypes): Promise<MatchTypes> {
        if (typeof data.places !== 'string') throw new Error(' is not a field');
        const result = await (
            await Match.create(data)
        ).populate('players', {
            email: 0,
            password: 0,
        });
        return result as MatchTypes;
    }
    async delete(id: id): Promise<id> {
        await Player.findByIdAndDelete(id);
        return id;
    }
    disconnect() {
        mongoose.disconnect();
    }
}

// async findOne(search:{[key: string]: string | Date}): Promise<MatchTypes>{
// //     const result = await Match.findOne(search).populate('players',{
//             email: 0,
//             password: 0
//         });;
// //     if(!result) throw new Error('Not found id');
//     return result as unknown as MatchTypes
// }
// }
