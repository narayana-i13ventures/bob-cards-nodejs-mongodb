import { Router } from 'express';
import Card from '../Models/CardModel.js';

const router = Router();

router.get('/CVP', async (req, res) => {
    try {
        const response = await Card.getFuture1CVP();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Future 1 CVP cards' });
    }
});

router.get('/CVP/chat', async (req, res) => {
    try {
        const response = await Card.getFuture1CVPCardChat();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Future 1 CVP cards Chat' });
    }
});

router.post('/CVP/prefill', async (req, res) => {
    try {
        const data = req?.body;
        const response = await Card.prefillFuture1CVP(data);
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error Prefilling Future 1 CVP cards' });
    }
});

router.post('/CVP/reset', async (req, res) => {
    try {
        const response = await Card.resetFuture1CVP();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error resetting CVP Cards' });
    }
});

export default router;
