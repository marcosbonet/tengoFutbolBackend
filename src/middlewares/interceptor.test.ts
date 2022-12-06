import { NextFunction, Response, Request } from 'express';

import { autori, ExtraRequest } from './interceptor.js';

describe('Given the interceptor', () => {
    const res: Partial<Response> = {};
    const next: NextFunction = jest.fn();

    describe('given logged function', () => {
        describe('when authorization is ok ', () => {
            test('then should pass to the next function', () => {
                const req: Partial<ExtraRequest> = {
                    get: jest
                        .fn()
                        .mockReturnValueOnce(
                            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzOGQ5NzA5NzUxODEzMzY1YTRiYWVjNyIsInBsYXllck5hbWUiOiJwZXBpdG8gIiwiaWF0IjoxNjcwMjIzNjQ3fQ.YLu_rdkN5IO41IdImLqe76c66ZQxJo78V8m61y5ZJFo'
                        ),
                };

                autori(req as ExtraRequest, res as Response, next);
                expect(next).toHaveBeenCalled();

                expect(req.payload).toStrictEqual({
                    id: expect.any(String),
                    iat: expect.any(Number),
                    playerName: expect.any(String),
                });
            });
        });
        describe('when the authorization is not ok ', () => {
            test('then if the authString is empty, it should return an error', () => {
                const req: Partial<Request> = {
                    get: jest.fn().mockReturnValueOnce(false),
                };

                autori(req as Request, res as Response, next);
                expect(next).toHaveBeenCalled();
            });
            test('Then if the token its not valid, it should return an error', () => {
                const req: Partial<Request> = {
                    get: jest.fn().mockReturnValueOnce('Bearer token'),
                };

                autori(req as Request, res as Response, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
