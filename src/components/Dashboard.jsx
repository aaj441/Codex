import React from 'react';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function Dashboard({ stats }) {
  if (!stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const workflowStats = stats.workflows.reduce((acc, item) => {
    acc[item.status] = item.count;
    return acc;
  }, {});

  const totalWorkflows = Object.values(workflowStats).reduce((sum, count) => sum + count, 0);
  const completedWorkflows = workflowStats.Done || 0;
  const activeWorkflows = workflowStats.Active || 0;
  const plannedWorkflows = workflowStats.Planned || 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Project Xavier Dashboard</h1>
        <p className="page-description">
          Welcome to your comprehensive workflow management platform
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Workflows</div>
          <div className="stat-value">{totalWorkflows}</div>
          <div className="stat-label">All Time</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Active Workflows</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{activeWorkflows}</div>
          <div className="stat-label">In Progress</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: '#6366f1' }}>{completedWorkflows}</div>
          <div className="stat-label">This Period</div>
        </div>

        <div className="card stat-card">
          <div className="stat-label">Planned</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{plannedWorkflows}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Projects Overview</h3>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Projects</span>
                <strong>{stats.projects?.total || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Progress</span>
                <strong>{Math.round(stats.projects?.avg_progress || 0)}%</strong>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.projects?.avg_progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Innovation Metrics</h3>
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Opportunities</span>
                <strong>{stats.innovations?.total || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Trend Score</span>
                <strong>{Math.round(stats.innovations?.avg_score || 0)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Activity</h3>
          <Clock size={20} />
        </div>
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Table</th>
                <th>Record ID</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <tr key={activity.log_id}>
                    <td>
                      <span className={`badge ${
                        activity.action === 'CREATE' ? 'badge-success' :
                        activity.action === 'UPDATE' ? 'badge-info' :
                        activity.action === 'DELETE' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {activity.action}
                      </span>
                    </td>
                    <td>{activity.table_name}</td>
                    <td>{activity.record_id || '-'}</td>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-state">No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
