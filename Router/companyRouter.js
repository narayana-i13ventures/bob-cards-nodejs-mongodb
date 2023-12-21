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
// GET Company By Id
router.get(
    '/:companyId',
    asyncHandler(async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const company = await Company.getCompanyById(companyId);
            if (!company) {
                return res.status(404).json({ error: 'Company not found' });
            }

            res.status(200).json(company);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching company' });
        }
    })
);
// GET Company By Id
router.post(
    '/delete/:companyId',
    asyncHandler(async (req, res) => {
        try {
            const companyId = req.params.companyId;
            const response = await Company.deleteCompanyById(companyId);
            if (!response?.success) {
                return res.status(404).json({ error: 'Company not found' });
            }
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting company' });
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

// Example usage in your route or controller
router.post('/add-shared-user', async (req, res) => {
    try {
        const { companyId, sharedUser } = req?.body;
        const response = await Company.addSharedUser(companyId, sharedUser);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error adding shared user', message: error.message });
    }
});

router.post('/delete-shared-user', async (req, res) => {
    try {
        const { companyId, sharedUserId } = req?.body;
        const response = await Company.deleteSharedUser(companyId, sharedUserId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting shared user', message: error.message });
    }
});


export default router;
