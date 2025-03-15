"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ✅ Create Account + Profile Together
app.post('/account', async (req, res) => {
    const { email, username, password, firstName, middleName, lastName, suffix, bio, picture } = req.body;
    try {
        const account = await prisma_1.default.account.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ✅ Add Modules to an Existing Account
app.post('/account/:id/module', async (req, res) => {
    const { id } = req.params;
    const { moduleCode, moduleDetails, moduleDesc } = req.body;
    try {
        const account = await prisma_1.default.account.findUnique({
            where: { id: parseInt(id) }
        });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }
        const module = await prisma_1.default.module.create({
            data: {
                accountCode: parseInt(id),
                moduleCode,
                moduleDetails,
                moduleDesc
            }
        });
        res.status(201).json(module);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ✅ Retrieve All Accounts with Profiles and Modules
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await prisma_1.default.account.findMany({
            include: {
                profile: true,
                modules: true
            }
        });
        res.status(200).json(accounts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ✅ Retrieve a Specific Account with Profile and Modules
app.get('/account/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const account = await prisma_1.default.account.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ✅ Delete an Account
app.delete('/account/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAccount = await prisma_1.default.account.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Account deleted successfully', deletedAccount });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
