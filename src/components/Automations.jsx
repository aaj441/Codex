import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/automations');
      const data = await response.json();
      setAutomations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching automations:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading automations...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Automations</h1>
        <p className="page-description">Manage your workflow automations</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Target Table</th>
              <th>Trigger Type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {automations.length > 0 ? (
              automations.map((automation) => (
                <tr key={automation.automation_id}>
                  <td><strong>{automation.name}</strong></td>
                  <td>{automation.target_table}</td>
                  <td>
                    <span className="badge badge-info">{automation.trigger_type}</span>
                  </td>
                  <td>
                    {automation.enabled ? (
                      <span className="badge badge-success">
                        <Play size={12} style={{ marginRight: '0.25rem' }} />
                        Active
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <Pause size={12} style={{ marginRight: '0.25rem' }} />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>{new Date(automation.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">No automations configured</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Automations;
