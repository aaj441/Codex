import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

function PortfolioSync() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/portfolio_sync');
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Portfolio Sync Studio</h1>
        <p className="page-description">Sync and manage your project portfolio</p>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Owner</th>
              <th>Progress</th>
              <th>Sync Status</th>
              <th>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.project_id}>
                  <td><strong>{project.project_name}</strong></td>
                  <td>{project.owner || '-'}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{project.progress}%</div>
                  </td>
                  <td>
                    <span className={`badge ${
                      project.sync_status === 'Synced' ? 'badge-success' :
                      project.sync_status === 'Queued' ? 'badge-warning' :
                      'badge-info'
                    }`}>
                      {project.sync_status}
                    </span>
                  </td>
                  <td>{project.last_sync ? new Date(project.last_sync).toLocaleString() : 'Never'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">No projects yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PortfolioSync;
