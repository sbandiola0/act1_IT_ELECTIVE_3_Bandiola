import express from 'express';
import prisma from './prisma';

const app = express();
app.use(express.json());

// ✅ Create Account + Profile Together
app.post('/account', async (req, res) => {
    const { email, username, password, firstName, middleName, lastName, suffix, bio, picture } = req.body;

    try {
        const account = await prisma.account.create({
            data: {
                email,
                username,
                password,
                profile: {
                    create: {
                        firstName,
                        middleName,
                        lastName,
                        suffix,
                        bio,
                        picture,
                    }
                }
            },
            include: {
                profile: true
            }
        });

        res.status(201).json(account);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Add Modules to an Existing Account
app.post('/account/:id/module', async (req, res) => {
    const { id } = req.params;
    const { moduleCode, moduleDetails, moduleDesc } = req.body;

    try {
        const account = await prisma.account.findUnique({
            where: { id: parseInt(id) }
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const module = await prisma.module.create({
            data: {
                accountCode: parseInt(id),
                moduleCode,
                moduleDetails,
                moduleDesc
            }
        });

        res.status(201).json(module);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Retrieve All Accounts with Profiles and Modules
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await prisma.account.findMany({
            include: {
                profile: true,
                modules: true
            }
        });

        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Retrieve a Specific Account with Profile and Modules
app.get('/account/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const account = await prisma.account.findUnique({
            where: { id: parseInt(id) },
            include: {
                profile: true,
                modules: true
            }
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Delete an Account
app.delete('/account/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAccount = await prisma.account.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Account deleted successfully', deletedAccount });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
