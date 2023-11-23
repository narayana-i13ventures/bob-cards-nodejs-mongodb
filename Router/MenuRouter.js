import express from 'express';
import Methodology from '../Models/MenuModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// 
router.get(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const response = await Methodology.getMenu();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: '' });
        }
    })
);
router.post(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const data = req?.body;
            const response = await Methodology.setMenu(data);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
);

// 
router.post(
    '/updateLock',
    asyncHandler(async (req, res) => {
        try {
            const data = req?.body;
            const response = await Methodology.toggleCanvasLocked(data);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
);
router.post(
    '/updateSelected',
    asyncHandler(async (req, res) => {
        try {
            const data = req?.body;
            const response = await Methodology.setCanvasSelected(data);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    })
);

export default router;
