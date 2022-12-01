import { Schema, Types, model } from 'mongoose';

export type ProtoPlayer = {
    playerName?: string;
    level?: number;
    email?: string;
    password?: string;
    matches?: string;
};

export type PlayerTypes = {
    id: string;
    playerName: string;
    level: number;
    email: string;
    password: string;
    matches: Array<string>;
};

export const playerSchema = new Schema<PlayerTypes>({
    playerName: {
        type: String,
        required: true,
    },
    level: { type: Number, min: 0, max: 10 },
    email: String,
    password: String,
    matches: [
        {
            type: Types.ObjectId,
            ref: 'Matches',
        },
    ],
});

playerSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.__id;
    },
});
export const Player = model<PlayerTypes>('Player', playerSchema, 'players');
