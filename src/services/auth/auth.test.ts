import jwt from 'jsonwebtoken';
import { createToken, getSecret, readToken } from './auth';

describe('GIven "getsecret', () => {
    describe('when is not a string', () => {
        test('then an error should be throw', () => {
            expect(() => {
                getSecret('');
            }).toThrowError();
        });
    });
});
const mock = { id: '2', name: 'pedro', role: '' };
describe('Given "createToken, when is is called', () => {
    const spyfunction = jest.spyOn(jwt, 'sign');
    const result = createToken(mock);
    expect(typeof result).toBe('string');
    expect(spyfunction).toHaveBeenCalled();
});
describe('Given "readToken" ', () => {
    describe('when token is valid', () => {
        const validToken = createToken(mock);
        test('then', () => {
            const result = readToken(validToken);
            expect(result.name).toEqual(mock.name);
        });
    });
});
