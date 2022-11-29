import mongoose from 'mongoose';
import { PASSWD, USERNAME } from '../../config.js';

export async function dbConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test' ? 'TengoFulbo' : 'TengoFulboTesting';
    let uri = `mongodb+srv://${USERNAME}:${PASSWD}@cluster0.63pjypu.mongodb.net/`;
    uri += `${DBName}?retryWrites=true&w=majority`;

    return mongoose.connect(uri);
}
