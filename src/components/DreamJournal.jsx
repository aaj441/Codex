import React, { useState, useEffect } from 'react';

function DreamJournal() {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dream_journal');
      const data = await response.json();
      setDreams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dreams:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dreams...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dream Journal</h1>
        <p className="page-description">Record and analyze your dreams</p>
      </div>

      <div className="dashboard-grid">
        {dreams.length > 0 ? (
          dreams.map((dream) => (
            <div key={dream.dream_id} className="card">
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {new Date(dream.date).toLocaleDateString()}
              </div>
              <h3 className="card-title">{dream.title || 'Untitled Dream'}</h3>
              <p style={{ margin: '0.5rem 0' }}>{dream.description}</p>
              {dream.symbols && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Symbols:</strong> {dream.symbols}
                </div>
              )}
              {dream.sentiment && (
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${
                    dream.sentiment === 'positive' ? 'badge-success' :
                    dream.sentiment === 'negative' ? 'badge-danger' :
                    'badge-info'
                  }`}>
                    {dream.sentiment}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">No dreams recorded yet</div>
        )}
      </div>
    </div>
  );
}

export default DreamJournal;
