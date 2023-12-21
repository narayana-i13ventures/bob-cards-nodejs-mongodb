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
import MenuRouter from './Router/MenuRouter.js'
import Card from './Models/CardModel.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB (replace 'your-connection-string' with your actual MongoDB connection string)
connectToDatabase(process.env.MONGODB_URL);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:3000', 'https://bob-ui-v-2-narayanas-projects.vercel.app', 'https://bob-ui-v-2-git-main-narayanas-projects.vercel.app', 'https://bob-ui-v-2.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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
app.use('/Menu', MenuRouter);
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

app.post('/resetCard', async (req, res) => {
    try {
        const data = req?.body;
        const response = await Card.resetCard(data);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error resetting Card' });
    }
});

app.post('/add-comment', async (req, res) => {
    try {
        const { cardId, comment } = req?.body;
        const response = await Card.addComment(cardId, comment);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error adding comment', message: error.message });
    }
});

app.post('/delete-comment', async (req, res) => {
    try {
        const { cardId, commentId, userName } = req?.body;
        const response = await Card.deleteComment(cardId, commentId, userName);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting comment', message: error.message });
    }
});

app.post('/add-shared-user', async (req, res) => {
    try {
        const { cardId, sharedUser } = req?.body;
        const response = await Card.addSharedUser(cardId, sharedUser);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error adding shared user', message: error.message });
    }
});

app.post('/delete-shared-user', async (req, res) => {
    try {
        const { cardId, sharedUserId } = req?.body;
        const response = await Card.deleteSharedUser(cardId, sharedUserId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting shared user', message: error.message });
    }
});

// Start the server for each worker
app.listen(port, () => {
    // console.log(`Worker ${process.pid} is running on port ${port}`);
});