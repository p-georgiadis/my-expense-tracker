// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path"); // Make sure to import only once
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// INCOMES Endpoints
// ---------------------
app.get("/api/incomes", (req, res) => {
    const { month } = req.query;
    if (month) {
        db.all("SELECT * FROM incomes WHERE month = ?", [month], (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    } else {
        db.all("SELECT * FROM incomes", (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    }
});

app.post("/api/incomes", (req, res) => {
    const { source, amount, assignedTo, category, month } = req.body;
    db.run(
        `INSERT INTO incomes (source, amount, assignedTo, category, month) VALUES (?, ?, ?, ?, ?)`,
        [source, amount, assignedTo, category, month],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({
                id: this.lastID,
                source,
                amount,
                assignedTo,
                category,
                month,
            });
        }
    );
});

app.put("/api/incomes/:id", (req, res) => {
    const { id } = req.params;
    const { source, amount, assignedTo, category, month } = req.body;
    db.run(
        `UPDATE incomes
         SET source=?, amount=?, assignedTo=?, category=?, month=?
         WHERE id=?`,
        [source, amount, assignedTo, category, month, id],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({ id, source, amount, assignedTo, category, month });
        }
    );
});

app.delete("/api/incomes/:id", (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM incomes WHERE id=?`, [id], function (err) {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

// ---------------------
// EXPENSES Endpoints
// ---------------------
app.get("/api/expenses", (req, res) => {
    const { month } = req.query;
    if (month) {
        db.all("SELECT * FROM expenses WHERE month = ?", [month], (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    } else {
        db.all("SELECT * FROM expenses", (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows);
        });
    }
});

app.post("/api/expenses", (req, res) => {
    const { description, amount, dueDate, assignedTo, category, month } = req.body;
    db.run(
        `INSERT INTO expenses (description, amount, dueDate, assignedTo, category, month)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [description, amount, dueDate, assignedTo, category, month],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({
                id: this.lastID,
                description,
                amount,
                dueDate,
                assignedTo,
                category,
                month,
            });
        }
    );
});

app.put("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const { description, amount, dueDate, assignedTo, category, month } = req.body;
    db.run(
        `UPDATE expenses
     SET description=?, amount=?, dueDate=?, assignedTo=?, category=?, month=?
     WHERE id=?`,
        [description, amount, dueDate, assignedTo, category, month, id],
        function (err) {
            if (err) return res.status(500).send(err);
            res.json({ id, description, amount, dueDate, assignedTo, category, month });
        }
    );
});

app.delete("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM expenses WHERE id=?`, [id], function (err) {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

// ---------------------
// Serve the React build
// ---------------------
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ---------------------
// Start the server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
