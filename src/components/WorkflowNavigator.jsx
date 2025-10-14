import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

function WorkflowNavigator() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    workflow_id: '',
    name: '',
    description: '',
    status: 'Planned',
    priority: 0,
    assigned_to: '',
    deadline: ''
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/workflow_navigator');
      const data = await response.json();
      setWorkflows(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `http://localhost:5000/api/workflow_navigator/${editingId}`
        : 'http://localhost:5000/api/workflow_navigator';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchWorkflows();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await fetch(`http://localhost:5000/api/workflow_navigator/${id}`, {
        method: 'DELETE'
      });
      fetchWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const handleEdit = (workflow) => {
    setFormData(workflow);
    setEditingId(workflow.workflow_id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      workflow_id: '',
      name: '',
      description: '',
      status: 'Planned',
      priority: 0,
      assigned_to: '',
      deadline: ''
    });
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Planned': 'badge-warning',
      'Active': 'badge-info',
      'Review': 'badge-success',
      'Done': 'badge-success'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return <div className="loading">Loading workflows...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Workflow Navigator</h1>
            <p className="page-description">Manage and track all your workflows</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Add Workflow
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.length > 0 ? (
              workflows.map((workflow) => (
                <tr key={workflow.workflow_id}>
                  <td>
                    <strong>{workflow.name}</strong>
                    {workflow.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {workflow.description}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </td>
                  <td>{workflow.priority}</td>
                  <td>{workflow.assigned_to || '-'}</td>
                  <td>{workflow.deadline ? new Date(workflow.deadline).toLocaleDateString() : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(workflow)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDelete(workflow.workflow_id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No workflows yet. Click "Add Workflow" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? 'Edit Workflow' : 'New Workflow'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {!editingId && (
                <div className="form-group">
                  <label className="form-label">Workflow ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.workflow_id}
                    onChange={(e) => setFormData({ ...formData, workflow_id: e.target.value })}
                    required
                  />
                </div>
              )}
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planned">Planned</option>
                  <option value="Active">Active</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned To</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowNavigator;
