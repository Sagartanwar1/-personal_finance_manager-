import express from 'express';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import transactionRoutes from './routes/transactions';

const app = express();
const prisma = new PrismaClient();

app.use(json());

app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Personal Finance API');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});