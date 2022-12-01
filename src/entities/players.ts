import { Schema, Types, model } from 'mongoose';

export type ProtoPlayer = {
    playerName?: string;
    level?: number;
    email?: string;
    password?: string;
};

export type PlayerTypes = {
    id: Types.ObjectId;
    playerName: string;
    level: number;
    email: string;
    password: string;
    matches?: Array<Types.ObjectId>;
};

export const playerSchema = new Schema<PlayerTypes>({
    playerName: {
        type: String,
        required: true,
        unique: true,
    },
    level: { type: Number, min: 0, max: 10 },
    email: String,
    password: String,
    matches: [
        {
            type: Types.ObjectId,
            ref: 'matches',
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
export const Player = model<PlayerTypes>('Matches', playerSchema, 'matches');
