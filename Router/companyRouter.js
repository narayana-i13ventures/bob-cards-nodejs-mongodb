import express from 'express';
import Company from '../Models/companyModel.js';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// GET all companies
router.get(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const companies = await Company.getAllCompanies();
            res.status(200).json(companies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching companies' });
        }
    })
);

// POST a new company
router.post(
    '/',
    asyncHandler(async (req, res) => {
        try {
            const companyData = req.body;
            const newCompany = await Company.createCompany(companyData);
            res.status(201).json(newCompany);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating company' });
        }
    })
);

export default router;
