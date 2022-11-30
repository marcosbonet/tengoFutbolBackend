import { Types } from 'mongoose';
import { Player } from '../entities/players';
import { dbConnect } from '../services/db.connect/db.connect';
import { PlayerRepo } from './repo.Player';

const mockData = [{ playerName: 'alvaro' }, { playerName: 'marcos' }];

describe('Given the Player respository', () => {
    const repository = PlayerRepo.getInstance();
    let testIds: Array<string>;
    const newPlayerMock = {
        id: new Types.ObjectId(),
        playerName: 'Juan',
        email: 'sdfad',
        level: 1,
        password: '1234',
    };
    const newPlayerMockArray = [
        {
            id: new Types.ObjectId(),
            playerName: 'alvaro',
            email: 'jajaja',
            level: 1,
            password: '1234',
        },
        {
            id: new Types.ObjectId(),
            playerName: 'Luis',
            email: 'lololo',
            level: 1,
            password: '1234',
        },
    ];

    beforeAll(async () => {
        await dbConnect();
        await Player.deleteMany();
        await Player.insertMany(mockData);
        const data = await Player.find();
        testIds = [data[0].id, data[1].id];
    });
    describe('When we instanciate post()', () => {
        test('it should return a new player', async () => {
            const result = await repository.post(newPlayerMock);
            expect(result.playerName).toBe(newPlayerMock.playerName);
        });
        // test('this must return the player that  we create ', ()=>{ expect (async ()=>{  await repository.post(newPlayer);}).rejects.toThrow();

        // })
    });
    describe('When we instanciate the get function', () => {
        test('it should return the array whit player', async () => {
            const result = await repository.get();
            expect(result[0].playerName).toEqual(
                newPlayerMockArray[0].playerName
            );
        });
    });
//     describe('When we instanciate the find function , with a key', () => {
//         test('it should return a player whit this key', async () => {
//             const result = await repository.find(newPlayerMockArray[0]);
//             expect(result.playerName).toEqual(mockData[0].playerName);
//         });
//     });
//     describe('when we instanicate the delete function, with a id', () => {
//         test('is choulr return the id of deleted player', async () => {
//             const result = await repository.delete(new TyPeof.ObjectId());
//             expect(result).toEqual({ id: testIds[0] });
//         });
//     });
// });
