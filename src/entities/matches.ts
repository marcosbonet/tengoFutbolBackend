import { model, Schema, Types } from 'mongoose';

export type ProtoMatch = {
    places?: string;
    date?: Date;
    image?: string;
    players?: Types.ObjectId;
};

export type MatchTypes = {
    id: Types.ObjectId;
    places: string;
    date: Date;
    image: string;
    players: Array<Types.ObjectId>;
};

export const matchSchema = new Schema<MatchTypes>({
    id: Types.ObjectId,
    places: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    image: String,

    players: [
        {
            type: Schema.Types.ObjectId,
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
