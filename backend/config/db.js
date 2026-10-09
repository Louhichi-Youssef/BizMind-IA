const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bizmind', {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[DB Error] MongoDB Atlas connection failed: ${error.message}`);
        console.log('[DB] Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/bizmind)...');
        try {
            const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/bizmind', {
                serverSelectionTimeoutMS: 3000
            });
            console.log(`[DB] Local MongoDB Connected: ${localConn.connection.host}`);
        } catch (localErr) {
            console.error(`[DB Error] Local MongoDB fallback failed: ${localErr.message}`);
            console.warn('[DB Warning] Server will run without a database connection. Add your current IP address to MongoDB Atlas whitelist (https://www.mongodb.com/docs/atlas/security-whitelist/) or start local MongoDB to enable database features.');
        }
    }
};

module.exports = connectDB;
