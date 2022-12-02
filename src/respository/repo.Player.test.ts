import { Player } from '../entities/players.js';
import { dbConnect } from '../services/db.connect/db.connect.js';
import { MatchRepo } from './repo.Match.js';
import { PlayerRepo } from './repo.Player.js';

describe('Given the Player respository', () => {
    const mockData = [{ playerName: 'alvaro' }, { playerName: 'marcos' }];

    const newPlayerMock = {
        playerName: 'Juan',
        email: 'sdfad',
        level: 1,
        password: '1234',
        matches: [],
    };
    const newPlayerMockArray = [
        {
            id: '6388a756ea85b251c768e200',
            playerName: 'alvaro',
            email: 'jajaja',
            level: 1,
            password: '1234',
            matches: [],
        },
        {
            id: '123456',
            playerName: 'Luis',
            email: 'lololo',
            level: 1,
            password: '1234',
            matches: [],
        },
    ];
    let testIds: Array<string>;
    const setUp = async () => {
        await dbConnect();
        await Player.deleteMany();
        await Player.insertMany(mockData);
        await Player.find();
        const data = await Player.find();
        testIds = [(data[0].id, data[1].id)];
        return testIds;
    };

    const repository = PlayerRepo.getInstance();
    MatchRepo.getInstance();

    beforeAll(async () => {
        await setUp();
    });
    describe('When we instanciate post()', () => {
        test('it should return a new player', async () => {
            const result = await repository.create(newPlayerMock);
            expect(result.playerName).toBe(newPlayerMock.playerName);
        });
    });
    describe('When we instanciate the get function', () => {
        test('it should return the array whit player', async () => {
            const result = await repository.get();
            expect(result[0].playerName).toEqual(
                newPlayerMockArray[0].playerName
            );
        });
    });
    describe('When we instanciate the getOne', () => {
        test('is should return a player of the specific id ', async () => {
            const createPlayerMock = await repository.create({
                playerName: 'messi',
                email: 'rosarino',
                level: 10,
                password: '1234',
                matches: [],
            });

            const result = await repository.getOne(
                createPlayerMock.id as unknown as string
            );

            expect(result.playerName).toEqual(createPlayerMock.playerName);
        });
    });

    describe('When we instanciate the query function , with a key', () => {
        test('it should return a player whit this key', async () => {
            await repository.query('playerName', 'alvaro');
            expect(newPlayerMockArray[0].playerName).toBe('alvaro');
        });
    });
    describe('when we instanicate the delete function, with a id', () => {
        test('it should return the id of deleted player', async () => {
            const result = await repository.delete(newPlayerMockArray[0].id);

            expect(result).toBe(newPlayerMockArray[0].id);
        });
    });
    describe('when we instanciate the update fucntion', () => {
        test('it should return the a new match with new pleyer', async () => {
            const updatePlayerMock = {
                playerName: 'DePaul',
                email: 'porteño',
                level: 7,
                password: '1234',
                matches: [],
            };
            const result = await repository.update(
                testIds[0],
                updatePlayerMock
            );
            expect(result.playerName).toBe('DePaul');
        });
    });

    afterAll(async () => {
        await repository.disconnect();
    });
});
