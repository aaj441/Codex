import React, { useState, useEffect } from 'react';

function InnovationFlow() {
  const [innovations, setInnovations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInnovations();
  }, []);

  const fetchInnovations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/innovation_flow');
      const data = await response.json();
      setInnovations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching innovations:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading innovations...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Innovation Flow Dashboard</h1>
        <p className="page-description">Track innovation opportunities and trends</p>
      </div>

      <div className="dashboard-grid">
        {innovations.length > 0 ? (
          innovations.map((innovation) => (
            <div key={innovation.opportunity_id} className="card">
              <h3 className="card-title">{innovation.title}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                {innovation.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {innovation.category && (
                  <span className="badge badge-info">{innovation.category}</span>
                )}
                <span className="badge badge-warning">Score: {innovation.trend_score}</span>
                <span className="badge badge-success">Impact: {innovation.impact}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No innovation opportunities yet</div>
        )}
      </div>
    </div>
  );
}

export default InnovationFlow;
