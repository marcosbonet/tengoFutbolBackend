import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}
