# Personal Financial Dashboard

A full-stack financial management application developed by **Panagiotis Georgiadis** that enables couples to track shared and individual expenses, manage monthly budgets, and analyze spending patterns. Built using modern web technologies and containerized for easy deployment.

## Features

### Core Functionality
- **Expense Management**: Track and categorize all expenses with details like description, amount, due date, and assignment
- **Income Tracking**: Record multiple income sources with categorization and assignment options
- **Shared Expense Handling**: Automatically calculates split costs between partners
- **Monthly Organization**: Data is organized by month for easy historical tracking and future planning
- **Summary Analytics**: View total expenses, income, and net calculations per person

### Technical Features
- **Real-time Updates**: Immediate database persistence using SQLite transactions
- **RESTful API**: Structured endpoints for CRUD operations on expenses and incomes
- **Data Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management both client and server-side
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Persistent Storage**: SQLite database with Docker volume mounting for data preservation

## Technical Architecture

### Frontend (React + Vite)
- Built with **React 18** using functional components and hooks
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling and responsive design
- Key components:
   - `ExpenseTracker`: Manages expense entries and calculations
   - `IncomeTracker`: Handles income sources and totals
   - `MonthSelector`: Controls date-based data filtering
   - UI Components: Modular, reusable interface elements

### Backend (Node.js + Express)
- **Express** server handling API routes and static file serving
- **SQLite3** database with prepared statements for security
- **CORS** enabled for development environment
- Key endpoints:
  ```
  GET    /api/expenses      - Retrieve expenses (optional month filter)
  POST   /api/expenses      - Create new expense
  PUT    /api/expenses/:id  - Update existing expense
  DELETE /api/expenses/:id  - Remove expense
  
  GET    /api/incomes       - Retrieve incomes (optional month filter)
  POST   /api/incomes       - Create new income
  PUT    /api/incomes/:id   - Update existing income
  DELETE /api/incomes/:id   - Remove income
  ```

### Database Schema
```sql
-- Expenses Table
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    amount REAL,
    dueDate TEXT,
    assignedTo TEXT,
    category TEXT,
    month TEXT
);

-- Incomes Table
CREATE TABLE incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT,
    amount REAL,
    assignedTo TEXT,
    category TEXT,
    month TEXT
);
```

### Docker Implementation
- **Multi-stage build** process:
   1. Build stage: Compiles React application
   2. Production stage: Sets up Node.js environment
- **Volume mounting** for database persistence
- **Health checks** for container monitoring
- **Non-root user** for security
- Environment configuration through Docker ENV variables

## Installation & Deployment

### Local Development
```bash
# Frontend Setup
cd frontend
yarn install
yarn dev    # Runs on localhost:5173

# Backend Setup
cd backend
yarn install
yarn dev    # Runs on localhost:5000
```

### Docker Deployment
```bash
# Build the image
docker build -t expense-tracker:latest .

# Create persistent volume
docker volume create expense_tracker_data

# Run container
docker run -d \
  --name expense-tracker \
  --restart always \
  -p 5000:5000 \
  -v expense_tracker_data:/app/data \
  expense-tracker:latest
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment setting
- `SQLITE_DB_PATH`: Database file location

## Development Workflow

### API Testing
Use curl or Postman to test endpoints:
```bash
# Example: Create new expense
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"description":"Rent","amount":1000,"assignedTo":"Shared","category":"Housing"}'
```

### Database Management
Direct SQLite commands:
```bash
# Access database
sqlite3 database.db

# View schema
.schema

# Query data
SELECT * FROM expenses WHERE month = '2024-01';
```

## Author & Maintenance
Developed by **Panagiotis Georgiadis** for personal use and shared for educational purposes. Feel free to fork and modify for your own financial tracking needs.

## License
This project is open for personal use and modification. Please attribute the original work when sharing or deploying modified versions.

---
For updates or issues, please contact the developer or submit through the repository's issue tracking system.