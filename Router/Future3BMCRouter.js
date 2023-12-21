import { Router } from 'express';
import Card from '../Models/CardModel.js';

const router = Router();

router.get('/BMC', async (req, res) => {
    try {
        const response = await Card.getFuture3BMC();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Future 3 BMC cards' });
    }
});

router.get('/BMC/chat', async (req, res) => {
    try {
        const response = await Card.Future3BMCCardChat();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Future 3 BMC cards Chat' });
    }
});

router.post('/BMC/nextCard', async (req, res) => {
    try {
        const card = req?.body;
        const response = await Card.Future3BMCNextCard(card);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error Updating Next Card' });
    }
});

router.post('/BMC/prefill', async (req, res) => {
    try {
        const data = req?.body;
        const response = await Card.prefillFuture3BMC(data);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error Prefilling Future 3 BMC cards' });
    }
});

router.post('/BMC/reset', async (req, res) => {
    try {
        const response = await Card.resetFuture3BMC();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error resetting BMC Cards' });
    }
});


export default router;
