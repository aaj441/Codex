import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/agents');
      const data = await response.json();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading agents...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Agents</h1>
        <p className="page-description">AI agents powering your automation</p>
      </div>

      <div className="dashboard-grid">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.agent_id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Bot size={24} color="var(--primary)" />
                <h3 className="card-title">{agent.name}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {agent.description}
              </p>
              <div style={{ 
                background: 'var(--bg-tertiary)', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap'
              }}>
                {agent.logic}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <span className={`badge ${agent.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {agent.enabled ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No agents configured</div>
        )}
      </div>
    </div>
  );
}

export default Agents;
