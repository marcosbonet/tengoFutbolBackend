import jwt from 'jsonwebtoken';
import {
    createToken,
    getSecret,
    passwdEncrypt,
    passwdValidate,
    readToken,
} from './auth';
import bc from 'bcryptjs';
import { Types } from 'mongoose';

describe('GIven "getsecret', () => {
    describe('when is not a string', () => {
        test('then an error should be throw', () => {
            expect(() => {
                getSecret('');
            }).toThrowError();
        });
    });
});
const mock = { id: new string(), playerName: 'pedro' };
describe('Given "createToken, when is is called', () => {
    test('then', () => {
        const spyfunction = jest.spyOn(jwt, 'sign');

        const result = createToken(mock);
        expect(typeof result).toBe('string');
        expect(spyfunction).toHaveBeenCalled();
    });
});
describe('Given "readToken" ', () => {
    describe('when token is valid', () => {
        const validToken = createToken(mock);
        test('then', () => {
            const result = readToken(validToken);
            expect(result.playerName).toEqual(mock.playerName);
        });
    });
});

describe(' given the passwdEncrypt function , then it is called', () => {
    test('then', () => {
        const spyfunction = jest.spyOn(bc, 'hash');
        passwdEncrypt('');
        expect(spyfunction).toHaveBeenCalled();
    });
    test('Then hash has called', async () => {
        bc.hash = jest.fn().mockReturnValue('prueba');
        const result = await passwdEncrypt('1234');
        expect(result).toBe('prueba');
    });
});

describe('Given the function passwdVlaidate, whwn it is call', () => {
    test('then', () => {
        const spyfunction = jest.spyOn(bc, 'compare');
        passwdValidate('12345', 'prueba');
        expect(spyfunction).toHaveBeenCalled();
    });
    test('then', async () => {
        bc.compare = jest.fn().mockReturnValue(true);
        const result = await passwdValidate('12345', 'prueba');
        expect(result).toBe(true);
    });
});
