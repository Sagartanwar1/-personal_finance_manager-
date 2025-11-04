import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Transaction } from '../../lib/api';

const TransactionDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchTransaction = async () => {
                try {
                    const response = await fetch(`/api/transactions/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch transaction');
                    }
                    const data = await response.json();
                    setTransaction(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchTransaction();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!transaction) return <div>No transaction found</div>;

    return (
        <div>
            <h1>Transaction Detail</h1>
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Category:</strong> {transaction.category}</p>
            <p><strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {transaction.date}</p>
        </div>
    );
};

export default TransactionDetail;