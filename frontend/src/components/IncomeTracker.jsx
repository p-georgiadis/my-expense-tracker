// src/components/IncomeTracker.jsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';

const IncomeTracker = ({ incomes, setIncomes, selectedMonth }) => {
    const incomeCategories = [
        'Salary',
        'Bonus',
        'Investment',
        'Rental Income',
        'Other',
    ];

    // ---------------------------
    // Add a new income (server)
    // ---------------------------
    const addIncome = () => {
        const payload = {
            source: '',
            amount: 0,
            assignedTo: 'Pano',
            category: 'Other',
            month: selectedMonth, // store the selectedMonth
        };

        fetch('/api/incomes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create income');
                return res.json();
            })
            .then((newIncome) => {
                setIncomes((prev) => [...prev, newIncome]);
            })
            .catch((err) => console.error('Error adding income:', err));
    };

    // ---------------------------
    // Delete income (server)
    // ---------------------------
    const deleteIncome = (id) => {
        fetch(`/api/incomes/${id}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete income');
                setIncomes((prev) => prev.filter((inc) => inc.id !== id));
            })
            .catch((err) => console.error('Error deleting income:', err));
    };

    // ---------------------------
    // Update income (server)
    // ---------------------------
    const updateIncome = (id, field, value) => {
        const oldIncome = incomes.find((inc) => inc.id === id);
        if (!oldIncome) return;

        const updated = {
            ...oldIncome,
            [field]: value,
            month: selectedMonth, // ensure we keep the same month or user changes if needed
        };

        fetch(`/api/incomes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update income');
                return res.json();
            })
            .then((updatedIncomeFromServer) => {
                setIncomes((prev) =>
                    prev.map((inc) => (inc.id === id ? updatedIncomeFromServer : inc))
                );
            })
            .catch((err) => console.error('Error updating income:', err));
    };

    return (
        <Card className="custom-card bg-gray-800 text-gray-200 mb-8">
            <CardHeader>
                <CardTitle>Monthly Income Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto">
                    <table className="table-auto w-full border-collapse text-sm">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="p-2">Source</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Amount</th>
                            {/* dateReceived REMOVED */}
                            <th className="p-2">Assigned To</th>
                            <th className="p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incomes.map((income) => (
                            <tr
                                key={income.id}
                                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
                            >
                                {/* SOURCE */}
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={income.source}
                                        onChange={(e) =>
                                            updateIncome(income.id, 'source', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                        placeholder="Income source"
                                    />
                                </td>

                                {/* CATEGORY */}
                                <td className="p-2">
                                    <select
                                        value={income.category}
                                        onChange={(e) =>
                                            updateIncome(income.id, 'category', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                    >
                                        {incomeCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* AMOUNT */}
                                <td className="p-2">
                                    <input
                                        type="number"
                                        value={income.amount}
                                        onChange={(e) =>
                                            updateIncome(income.id, 'amount', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                        placeholder="0.00"
                                    />
                                </td>

                                {/* ASSIGNED TO */}
                                <td className="p-2">
                                    <select
                                        value={income.assignedTo}
                                        onChange={(e) =>
                                            updateIncome(income.id, 'assignedTo', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                    >
                                        <option value="Pano">Pano</option>
                                        <option value="Eva">Eva</option>
                                    </select>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-2">
                                    <button
                                        onClick={() => deleteIncome(income.id)}
                                        className="p-1 text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={addIncome}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
                >
                    <Plus size={18} />
                    Add Income
                </button>
            </CardContent>
        </Card>
    );
};

export default IncomeTracker;
