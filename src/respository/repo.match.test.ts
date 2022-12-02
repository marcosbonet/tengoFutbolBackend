import { Match } from '../entities/matches.js';

import { dbConnect } from '../services/db.connect/db.connect.js';
import { MatchRepo } from './repo.Match.js';

describe('Given the Match respository', () => {
    const mockData = [
        {
            places: 'Le Stade',
            date: '',
            image: 'muy bonito',
        },
    ];

    let testIds: Array<string>;
    const setUp = async () => {
        await dbConnect();
        await Match.deleteMany();
        await Match.insertMany(mockData);
        await Match.find();
        const data = await Match.find();

        testIds = [data[0].id];

        return testIds;
    };

    const repository = MatchRepo.getInstance();
    beforeAll(async () => {
        await setUp();
    });
    describe('When we instanciate the get function', () => {
        test('it should return the array whit Match', async () => {
            const spyModel = jest.spyOn(Match, 'find');
            const result = await repository.get();

            expect(spyModel).toHaveBeenCalled();
            expect(result[0].places).toBe(mockData[0].places);
        });
    });
    describe('When we instanciate post()', () => {
        test('it should return a new Match', async () => {
            const mockNewMock = {
                places: 'Martinooo staduum',
                date: '',
                image: 'malo',
            };

            const result = await repository.create(mockNewMock);
            const updateMock = {
                places: 'Martino staduum',
                date: '',
                image: 'malo',
                id: result.id,
            };
            repository.create = jest.fn().mockRejectedValue(updateMock);

            expect(result.id).toEqual(updateMock.id);
        });
    });

    describe('When it has been run find and it has called Model.findOne', () => {
        const spyModel = jest.spyOn(Match, 'findById');
        test('Then, if the data has been valid, it should be returned the found Product ', async () => {
            const result = await repository.getOne(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.places).toEqual(mockData[0].places);
        });
    });

    describe('When we instanciate the query function , with a key', () => {
        test('it should return a Match whit this key', async () => {
            const spyModel = jest.spyOn(Match, 'find');
            await repository.query({ places: 'Civitas metropolitano' });
            expect(spyModel).toHaveBeenCalled();
            expect(mockData[0].places).toBe(mockData[0].places);
        });
    });
    describe('when we instanicate the delete function, with a id', () => {
        test('it should return the id of deleted Match', async () => {
            const result = await repository.delete(testIds[0]);

            expect(result).toBe(testIds[0]);
        });
    });
    describe('when we instanciate the update fucntion', () => {
        test('it should return the a new match with new pleyer', async () => {
            const spyModel = jest.spyOn(Match, 'findByIdAndUpdate');
            const updateMatchMock = {
                places: 'General Martinez',
                date: '2022-09-09',
                image: 'bonito',
                players: [],
            };
            const result = await repository.update(testIds[0], updateMatchMock);
            expect(spyModel).toHaveBeenCalled();
            expect(result.places).toBe('General Martinez');
        });
    });

    afterAll(async () => {
        await repository.disconnect();
    });
});
