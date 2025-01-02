// src/components/ExpenseTracker.jsx
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';

const ExpenseTracker = ({ expenses, setExpenses }) => {
    const categories = [
        'Housing',
        'Utilities',
        'Transportation',
        'Insurance',
        'Groceries',
        'Entertainment',
        'Healthcare',
        'Debt Payments',
        'Savings',
        'Childcare',
        'Personal Care',
        'Subscriptions',
        'Travel',
        'Other',
    ];

    const addExpense = () => {
        const payload = {
            description: '',
            amount: 0,
            dueDate: '',
            assignedTo: 'Shared',
            category: 'Other',
        };

        fetch('/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to create expense');
                return res.json();
            })
            .then((newExpense) => {
                setExpenses((prev) => [...prev, newExpense]);
            })
            .catch((err) => console.error('Error adding expense:', err));
    };

    const deleteExpense = (id) => {
        fetch(`/api/expenses/${id}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to delete expense');
                setExpenses((prev) => prev.filter((exp) => exp.id !== id));
            })
            .catch((err) => console.error('Error deleting expense:', err));
    };

    const updateExpense = (id, field, value) => {
        const oldExpense = expenses.find((exp) => exp.id === id);
        if (!oldExpense) return;

        const updated = { ...oldExpense, [field]: value };

        fetch(`/api/expenses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to update expense');
                return res.json();
            })
            .then((updatedExpenseFromServer) => {
                setExpenses((prev) =>
                    prev.map((exp) => (exp.id === id ? updatedExpenseFromServer : exp))
                );
            })
            .catch((err) => console.error('Error updating expense:', err));
    };

    const calculateTotals = () => {
        const totals = {
            total: 0,
            byPerson: {
                Shared: 0,
                Pano: 0,
                Eva: 0,
            },
        };

        expenses.forEach((exp) => {
            const amount = parseFloat(exp.amount) || 0;
            totals.total += amount;

            if (exp.assignedTo === 'Shared') {
                totals.byPerson.Shared += amount;
            } else {
                totals.byPerson[exp.assignedTo] += amount;
            }
        });

        return totals;
    };

    const totals = calculateTotals();

    return (
        <Card className="custom-card bg-gray-800 text-gray-200">
            <CardHeader>
                <CardTitle>Monthly Expense Tracker</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Overflow container for horizontal scroll on mobile */}
                <div className="w-full overflow-x-auto">
                    <table className="table-auto w-full border-collapse text-sm">
                        <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
                        <tr>
                            <th className="p-2">Description</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Due Date</th>
                            <th className="p-2">Assigned To</th>
                            <th className="p-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
                            >
                                {/* DESCRIPTION */}
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={expense.description}
                                        onChange={(e) =>
                                            updateExpense(expense.id, 'description', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                        placeholder="Description"
                                    />
                                </td>

                                {/* CATEGORY */}
                                <td className="p-2">
                                    <select
                                        value={expense.category}
                                        onChange={(e) =>
                                            updateExpense(expense.id, 'category', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                    >
                                        {categories.map((cat) => (
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
                                        value={expense.amount}
                                        onChange={(e) =>
                                            updateExpense(expense.id, 'amount', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                        placeholder="0.00"
                                    />
                                </td>

                                {/* DUE DATE */}
                                <td className="p-2">
                                    <input
                                        type="date"
                                        value={expense.dueDate}
                                        onChange={(e) =>
                                            updateExpense(expense.id, 'dueDate', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                    />
                                </td>

                                {/* ASSIGNED TO */}
                                <td className="p-2">
                                    <select
                                        value={expense.assignedTo}
                                        onChange={(e) =>
                                            updateExpense(expense.id, 'assignedTo', e.target.value)
                                        }
                                        className="w-full p-1 bg-gray-900 text-gray-100 border border-gray-700 rounded"
                                    >
                                        <option value="Shared">Shared</option>
                                        <option value="Pano">Pano</option>
                                        <option value="Eva">Eva</option>
                                    </select>
                                </td>

                                {/* ACTIONS */}
                                <td className="p-2">
                                    <button
                                        onClick={() => deleteExpense(expense.id)}
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
                    onClick={addExpense}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
                >
                    <Plus size={18} />
                    Add Expense
                </button>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-700 text-gray-200 rounded">
                    <h3 className="font-bold mb-2">Summary (Local Calculation)</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold">
                                Total Expenses: ${totals.total.toFixed(2)}
                            </p>
                            <p>Shared Expenses: ${totals.byPerson.Shared.toFixed(2)}</p>
                            <p>
                                Each Person’s Share of Shared:{' '}
                                {(totals.byPerson.Shared / 2).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p>Pano’s Individual Expenses: ${totals.byPerson.Pano.toFixed(2)}</p>
                            <p>Eva’s Individual Expenses: ${totals.byPerson.Eva.toFixed(2)}</p>
                            <p className="mt-2 font-semibold">
                                Pano’s Total:{' '}
                                {(
                                    totals.byPerson.Pano + totals.byPerson.Shared / 2
                                ).toFixed(2)}
                            </p>
                            <p className="font-semibold">
                                Eva’s Total:{' '}
                                {(
                                    totals.byPerson.Eva + totals.byPerson.Shared / 2
                                ).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpenseTracker;
