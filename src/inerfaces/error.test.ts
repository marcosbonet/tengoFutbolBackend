import { CustomError, HTTPError } from './error.js';

describe('Given', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error: CustomError;
    beforeEach(() => {
        error = new HTTPError(418, 'funny cat', 'is it a big error');
    });
    test('should first', () => {
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(HTTPError);
        expect(error).toHaveProperty('statusCode', 418);
        expect(error).toHaveProperty('statusMessage', 'funny cat');
        expect(error).toHaveProperty('message', 'is it a big error');
        expect(error).toHaveProperty('name', 'HTTPError');
    });
});
