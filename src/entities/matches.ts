import { model, Schema, Types } from 'mongoose';

export type ProtoMatch = {
    places?: string;
    date?: string;
    image?: string;
    players?: Array<string>;
};

export type MatchTypes = {
    id: string;
    places: string;
    date: string;
    image: string;
    players: Array<string>;
};

export const matchSchema = new Schema<MatchTypes>({
    places: String,
    date: String,
    image: String,

    players: [
        {
            type: Types.ObjectId,
            ref: 'Player',
        },
    ],
});

matchSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.__id;
    },
});
export const Match = model<MatchTypes>('Matches', matchSchema, 'matches');
