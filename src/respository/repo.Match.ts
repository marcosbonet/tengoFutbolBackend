import mongoose, { Types } from 'mongoose';
import { Match, MatchTypes } from '../entities/matches';

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
    async patch(id: id, updateMatch: Partial<MatchTypes>): Promise<MatchTypes> {
        const result = await Match.findByIdAndUpdate(id, updateMatch, {
            new: true,
        }).populate('players', {
            email: 0,
            password: 0,
        });
        if (!result) throw new Error('Not found id');
        return result as MatchTypes;
    }
    async post(data: MatchTypes): Promise<MatchTypes> {
        if (typeof data.places !== 'string') throw new Error(' is not a field');
        const result = await Match.create(data);
        return result as MatchTypes;
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
