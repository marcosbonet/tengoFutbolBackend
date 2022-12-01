import { JwtPayload } from 'jwt-decode';

export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}
