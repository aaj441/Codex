import React, { useState, useEffect } from 'react';

function HealthMetrics() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health_metrics');
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading metrics...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Health Metrics</h1>
        <p className="page-description">Track your health and wellness data</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Value</th>
              <th>Source</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {metrics.length > 0 ? (
              metrics.map((metric) => (
                <tr key={metric.metric_id}>
                  <td>{new Date(metric.date).toLocaleDateString()}</td>
                  <td><span className="badge badge-info">{metric.metric_type}</span></td>
                  <td><strong>{metric.value} {metric.unit}</strong></td>
                  <td>{metric.source || '-'}</td>
                  <td>{metric.notes || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">No health metrics yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HealthMetrics;
