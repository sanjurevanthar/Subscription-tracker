import mongoose from 'mongoose';

import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error('Please Define MongoDB_URI environment variable inside .env.<production/development>.local');

}

const connectToDatabase = async() => {
    try{
        await mongoose.connect(DB_URI);

        console.log(`Connected Database in ${NODE_ENV} mode...`);
    }
    catch(error){
        console.error('Error Connecting to the database: ', error);
        process.exit(1);
    }
}

export default connectToDatabase;