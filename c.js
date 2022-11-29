import mongoose from 'mongoose';
const uri =
    'mongodb+srv://marcosbonet:12345@cluster0.63pjypu.mongodb.net/?retryWrites=true&w=majority';

const connetion = async () => {
    console.log('Stating connection');
    const r = await mongoose.connect(uri);
    console.log(r.connection.name);
};

connetion();
