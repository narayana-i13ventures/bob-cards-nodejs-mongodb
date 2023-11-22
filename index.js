import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectToDatabase } from './connectDB.js';
import companyRouter from './Router/companyRouter.js';
import Future1BMCRouter from './Router/Future1BMCRouter.js'
import Future2BMCRouter from './Router/Future2BMCRouter.js'
import Future3BMCRouter from './Router/Future3BMCRouter.js'
import Future1CVPRouter from './Router/Future1CVPRouter.js'
import ThinkBeyondRouter from './Router/ThinkBeyondRouter.js';
import Card from './Models/CardModel.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB (replace 'your-connection-string' with your actual MongoDB connection string)
connectToDatabase('mongodb+srv://narayana:Narayana1997@bob.ajbel4v.mongodb.net/data');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:'*'
}));
app.use(helmet());

// Basic route that returns 'Hello'
app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/company', companyRouter);
app.use('/future_1', Future1BMCRouter);
app.use('/future_2', Future2BMCRouter);
app.use('/future_3', Future3BMCRouter);
app.use('/future_1', Future1CVPRouter);
app.use('/', ThinkBeyondRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.post('/updateCard', async (req, res) => {
    try {
        const { data } = req?.body;
        const updatedCard = await Card.updateCard(data);
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Card' });
    }
});

// Start the server for each worker
app.listen(port, () => {
    // console.log(`Worker ${process.pid} is running on port ${port}`);
});