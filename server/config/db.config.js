import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MongoURL);
        console.log(`Connected to database!!!`.bgGreen.white);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`.bgRed.white);
        process.exit(1); // Optionally exit if connection fails
    }
};

let sessionStore;

const createSessionStore = async () => {
    if (!sessionStore) {
        try {
            if (mongoose.connection.readyState === 0) {
                await connectDatabase();
            }
            sessionStore = MongoStore.create({
                mongoUrl: process.env.MongoURL,
                collectionName: 'sessions'
            });
        } catch (error) {
            console.log("Error creating session store:", error);
        }
    }
    return sessionStore;
};


export {connectDatabase, createSessionStore};