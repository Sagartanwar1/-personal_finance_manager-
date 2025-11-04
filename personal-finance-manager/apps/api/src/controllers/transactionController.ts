import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (req: Request, res: Response) => {
    const { type, category, amount, date } = req.body;

    try {
        const transaction = await prisma.transaction.create({
            data: {
                type,
                category,
                amount,
                date,
            },
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
};

export const listTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: {
                date: 'desc',
            },
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve transactions' });
    }
};