import { Router } from 'express';
import ThinkBeyond from '../Models/ThinkBeyondModel.js';

const router = Router();

router.get('/ThinkBeyond', async (req, res) => {
    try {
        const ThinkBeyondCards = await ThinkBeyond.getThinkBeyond()
        res.status(200).json(ThinkBeyondCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching Think Beyond cards' });
    }
});

router.post('/ThinkBeyond', async (req, res) => {
    try {
        const data = req?.body;
        const updatedCard = await ThinkBeyond.updateThinkBeyond(data);
        res.status(200).json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Think Beyond card' });
    }
});
router.post('/ThinkBeyond/nextCard', async (req, res) => {
    try {
        const {cardId} = req?.body;
        const nextCards = await ThinkBeyond.nextCard(cardId);
        res.status(200).json(nextCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Think Beyond card' });
    }
});



router.post('/ThinkBeyond/reset', async (req, res) => {
    try {
        const resetThinkBeyondCards = await ThinkBeyond.resetThinkBeyond();
        res.status(200).json(resetThinkBeyondCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error resetting Think Beyond Cards' });
    }
});
export default router;
