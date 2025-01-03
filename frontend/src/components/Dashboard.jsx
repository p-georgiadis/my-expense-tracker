// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import IncomeTracker from './IncomeTracker.jsx';
import ExpenseTracker from './ExpenseTracker.jsx';

const Dashboard = () => {
    // ----------------------------
    // 1) Use localStorage to read the last month or default
    // ----------------------------
    const [selectedMonth, setSelectedMonth] = useState(() => {
        // Attempt to load from localStorage
        const savedMonth = localStorage.getItem('selectedMonth');
        return savedMonth || '2024-01'; // fallback if none found
    });

    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);

    // ----------------------------
    // 2) Whenever selectedMonth changes, store it in localStorage
    // ----------------------------
    useEffect(() => {
        localStorage.setItem('selectedMonth', selectedMonth);
    }, [selectedMonth]);

    // ----------------------------
    // 3) Fetch data for this month
    // ----------------------------
    useEffect(() => {
        fetch(`/api/incomes?month=${selectedMonth}`)
            .then((res) => res.json())
            .then((data) => setIncomes(data))
            .catch((err) => console.error('Error fetching incomes:', err));

        fetch(`/api/expenses?month=${selectedMonth}`)
            .then((res) => res.json())
            .then((data) => setExpenses(data))
            .catch((err) => console.error('Error fetching expenses:', err));
    }, [selectedMonth]);

    // ----------------------------
    // 4) Summaries
    // ----------------------------
    const calculateNetIncome = () => {
        const panoIncomes = incomes
            .filter((inc) => inc.assignedTo === 'Pano')
            .reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);

        const evaIncomes = incomes
            .filter((inc) => inc.assignedTo === 'Eva')
            .reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);

        const panoExpenses = expenses
            .filter((exp) => exp.assignedTo === 'Pano')
            .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        const evaExpenses = expenses
            .filter((exp) => exp.assignedTo === 'Eva')
            .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        const sharedExpenses = expenses
            .filter((exp) => exp.assignedTo === 'Shared')
            .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

        const halfShared = sharedExpenses / 2;
        const panoNet = panoIncomes - (panoExpenses + halfShared);
        const evaNet = evaIncomes - (evaExpenses + halfShared);
        const totalIncome = panoIncomes + evaIncomes;
        const totalExpenses = panoExpenses + evaExpenses + sharedExpenses;

        return {
            panoIncomes,
            evaIncomes,
            panoExpenses,
            evaExpenses,
            sharedExpenses,
            panoNet,
            evaNet,
            totalIncome,
            totalExpenses,
        };
    };

    const {
        panoIncomes,
        evaIncomes,
        panoExpenses,
        evaExpenses,
        sharedExpenses,
        panoNet,
        evaNet,
        totalIncome,
        totalExpenses,
    } = calculateNetIncome();

    // Some example months for the user to select
    const monthOptions = [
        '2025-01',
        '2025-02',
        '2025-03',
        '2025-04',
        '2025-05',
        '2025-06',
        '2025-07',
        '2025-08',
        '2025-09',
        '2025-10',
        '2025-11',
        '2025-12',
        '2026-01',
        '2026-02',
        '2026-03',
        '2026-04',
        '2026-05',
        '2026-06',
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Header / Nav */}
            <header className="bg-gray-800 shadow py-4 mb-6">
                <div className="container px-4 mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Financial Dashboard</h1>

                    {/* Month Selector */}
                    <div className="flex items-center space-x-2">
                        <label className="font-medium">Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-gray-700 text-gray-100 p-1 rounded"
                        >
                            {monthOptions.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <div className="container px-4 mx-auto space-y-6">
                {/* Pass selectedMonth to the trackers so they can include it in POST/PUT */}
                <IncomeTracker
                    incomes={incomes}
                    setIncomes={setIncomes}
                    selectedMonth={selectedMonth}
                />

                <ExpenseTracker
                    expenses={expenses}
                    setExpenses={setExpenses}
                    selectedMonth={selectedMonth}
                />

                {/* Net Income Summary Card */}
                <Card className="custom-card bg-gray-800 text-gray-100">
                    <CardHeader>
                        <CardTitle>Net Income Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-xl font-medium mb-2">Incomes & Expenses</h2>
                                <p>
                                    Pano&apos;s Total Income:{' '}
                                    <strong>${panoIncomes.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Eva&apos;s Total Income:{' '}
                                    <strong>${evaIncomes.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Pano&apos;s Expenses (No Shared):{' '}
                                    <strong>${panoExpenses.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Eva&apos;s Expenses (No Shared):{' '}
                                    <strong>${evaExpenses.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Shared Expenses (Split 50/50):{' '}
                                    <strong>${sharedExpenses.toFixed(2)}</strong>
                                </p>
                            </div>
                            <div>
                                <h2 className="text-xl font-medium mb-2">Net Results</h2>
                                <p>
                                    Total Income (Both):{' '}
                                    <strong>${totalIncome.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Total Expenses (All):{' '}
                                    <strong>${totalExpenses.toFixed(2)}</strong>
                                </p>
                                <p className="mt-2">
                                    Pano&apos;s Net Income: <strong>${panoNet.toFixed(2)}</strong>
                                </p>
                                <p>
                                    Eva&apos;s Net Income: <strong>${evaNet.toFixed(2)}</strong>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
