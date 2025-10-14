import React, { useState, useEffect } from 'react';

function MoneyMoves() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/money_moves');
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Money Moves</h1>
        <p className="page-description">Track your financial transactions</p>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Income</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            ${totalIncome.toFixed(2)}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>
            ${totalExpense.toFixed(2)}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Net Balance</div>
          <div className="stat-value" style={{ color: totalIncome - totalExpense >= 0 ? '#10b981' : '#ef4444' }}>
            ${(totalIncome - totalExpense).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${
                      transaction.type === 'income' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>{transaction.category}</td>
                  <td>
                    <strong style={{ color: transaction.type === 'income' ? '#10b981' : '#ef4444' }}>
                      ${transaction.amount.toFixed(2)}
                    </strong>
                  </td>
                  <td>{transaction.description || '-'}</td>
                  <td>
                    <span className="badge badge-info">{transaction.status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MoneyMoves;
