import { useEffect, useState } from 'react';
import Header from '../components/Header';
import TransactionList from '../components/TransactionList';
import { fetchTransactions } from '../lib/api';

const Home = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadTransactions = async () => {
            const data = await fetchTransactions();
            setTransactions(data);
        };

        loadTransactions();
    }, []);

    return (
        <div>
            <Header />
            <h1>Personal Finance Manager</h1>
            <TransactionList transactions={transactions} />
        </div>
    );
};

export default Home;