import { useEffect, useState } from 'react';
import TransactionList from '../../components/TransactionList';
import TransactionForm from '../../components/TransactionForm';
import { Transaction } from '../../lib/api';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch('/api/transactions');
            const data = await response.json();
            setTransactions(data);
            setLoading(false);
        };

        fetchTransactions();
    }, []);

    const handleTransactionCreated = (newTransaction: Transaction) => {
        setTransactions((prev) => [newTransaction, ...prev]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Transactions</h1>
            <TransactionForm onTransactionCreated={handleTransactionCreated} />
            <TransactionList transactions={transactions} />
        </div>
    );
};

export default TransactionsPage;