const express = require('express');
const cors = require('cors');
const { dbAll, dbRun, dbGet } = require('./database');
const { initializeAutomations } = require('./automations');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize automations
initializeAutomations();

// Generic CRUD endpoints for all tables
const tables = [
  'workflow_navigator',
  'portfolio_sync',
  'innovation_flow',
  'backend_insight',
  'dream_journal',
  'scrobble_history',
  'xavier_lore',
  'health_metrics',
  'money_moves',
  'system_config',
  'automations',
  'agents',
  'activity_log'
];

// GET all records from a table
app.get('/api/:table', async (req, res) => {
  const { table } = req.params;
  
  if (!tables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const rows = await dbAll(`SELECT * FROM ${table} ORDER BY rowid DESC`);
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// GET single record by ID
app.get('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  
  if (!tables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const idColumn = getIdColumn(table);
    const row = await dbGet(`SELECT * FROM ${table} WHERE ${idColumn} = ?`, [id]);
    
    if (!row) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(row);
  } catch (error) {
    console.error(`Error fetching record:`, error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new record
app.post('/api/:table', async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  
  if (!tables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const result = await dbRun(sql, values);
    
    // Log activity
    await logActivity('CREATE', table, data[getIdColumn(table)] || result.id, JSON.stringify(data));
    
    res.status(201).json({ 
      message: 'Record created successfully',
      id: data[getIdColumn(table)] || result.id 
    });
  } catch (error) {
    console.error(`Error creating record:`, error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update record
app.put('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  
  if (!tables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const idColumn = getIdColumn(table);
    const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const sql = `UPDATE ${table} SET ${updates} WHERE ${idColumn} = ?`;
    await dbRun(sql, values);
    
    // Log activity
    await logActivity('UPDATE', table, id, JSON.stringify(data));
    
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error(`Error updating record:`, error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE record
app.delete('/api/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  
  if (!tables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const idColumn = getIdColumn(table);
    await dbRun(`DELETE FROM ${table} WHERE ${idColumn} = ?`, [id]);
    
    // Log activity
    await logActivity('DELETE', table, id, '');
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(`Error deleting record:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = {
      workflows: await dbAll(`
        SELECT status, COUNT(*) as count 
        FROM workflow_navigator 
        GROUP BY status
      `),
      projects: await dbGet(`
        SELECT 
          COUNT(*) as total,
          AVG(progress) as avg_progress
        FROM portfolio_sync
      `),
      innovations: await dbGet(`
        SELECT 
          COUNT(*) as total,
          AVG(trend_score) as avg_score
        FROM innovation_flow
      `),
      recentActivity: await dbAll(`
        SELECT * FROM activity_log 
        ORDER BY timestamp DESC 
        LIMIT 10
      `)
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function getIdColumn(table) {
  const idColumns = {
    workflow_navigator: 'workflow_id',
    portfolio_sync: 'project_id',
    innovation_flow: 'opportunity_id',
    backend_insight: 'insight_id',
    dream_journal: 'dream_id',
    scrobble_history: 'scrobble_id',
    xavier_lore: 'lore_id',
    health_metrics: 'metric_id',
    money_moves: 'transaction_id',
    system_config: 'config_key',
    automations: 'automation_id',
    agents: 'agent_id',
    activity_log: 'log_id'
  };
  return idColumns[table] || 'id';
}

async function logActivity(action, table, recordId, details) {
  try {
    await dbRun(
      `INSERT INTO activity_log (action, table_name, record_id, details) 
       VALUES (?, ?, ?, ?)`,
      [action, table, recordId, details]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
