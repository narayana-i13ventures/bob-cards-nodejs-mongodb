import mongoose from 'mongoose';

// Function to establish a connection to MongoDB
export const connectToDatabase = (connectionString) => {
    mongoose.connect(connectionString);

    const db = mongoose.connection;

    db.once('open', () => {
        // console.log('Connected to MongoDB');
        // console.log('Host: ' + db.host);
        // console.log('Port: ' + db.port);
        // console.log('Database Name: ' + db.name);
    });

    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
};
