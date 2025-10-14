const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'xavier.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Database connected');
    initializeTables();
  }
});

function initializeTables() {
  // Workflow Navigator Table
  db.run(`
    CREATE TABLE IF NOT EXISTS workflow_navigator (
      workflow_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'Planned',
      priority INTEGER DEFAULT 0,
      assigned_to TEXT,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline DATE
    )
  `);

  // Portfolio Sync Studio
  db.run(`
    CREATE TABLE IF NOT EXISTS portfolio_sync (
      project_id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      owner TEXT,
      progress INTEGER DEFAULT 0,
      sync_status TEXT DEFAULT 'Draft',
      last_sync DATETIME,
      review_date DATE
    )
  `);

  // Innovation Flow Dashboard
  db.run(`
    CREATE TABLE IF NOT EXISTS innovation_flow (
      opportunity_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      trend_score INTEGER DEFAULT 0,
      category TEXT,
      impact INTEGER DEFAULT 0,
      owner TEXT,
      review_status TEXT DEFAULT 'New'
    )
  `);

  // Backend Insight
  db.run(`
    CREATE TABLE IF NOT EXISTS backend_insight (
      insight_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      priority INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'Active'
    )
  `);

  // Dream Journal
  db.run(`
    CREATE TABLE IF NOT EXISTS dream_journal (
      dream_id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      title TEXT,
      description TEXT,
      symbols TEXT,
      sentiment TEXT,
      interpretation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Scrobble History
  db.run(`
    CREATE TABLE IF NOT EXISTS scrobble_history (
      scrobble_id TEXT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      track_name TEXT,
      artist TEXT,
      album TEXT,
      duration INTEGER,
      source TEXT
    )
  `);

  // Xavier Lore
  db.run(`
    CREATE TABLE IF NOT EXISTS xavier_lore (
      lore_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      category TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Health Metrics
  db.run(`
    CREATE TABLE IF NOT EXISTS health_metrics (
      metric_id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      metric_type TEXT,
      value REAL,
      unit TEXT,
      notes TEXT,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Money Moves
  db.run(`
    CREATE TABLE IF NOT EXISTS money_moves (
      transaction_id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      type TEXT,
      amount REAL,
      category TEXT,
      description TEXT,
      status TEXT DEFAULT 'Completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // System Config
  db.run(`
    CREATE TABLE IF NOT EXISTS system_config (
      config_key TEXT PRIMARY KEY,
      config_value TEXT,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Automations
  db.run(`
    CREATE TABLE IF NOT EXISTS automations (
      automation_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_table TEXT,
      trigger_type TEXT,
      trigger_config TEXT,
      actions TEXT,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Agents
  db.run(`
    CREATE TABLE IF NOT EXISTS agents (
      agent_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      logic TEXT,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Activity Log
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      log_id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      action TEXT,
      table_name TEXT,
      record_id TEXT,
      user TEXT,
      details TEXT
    )
  `);

  console.log('✅ All tables initialized');
}

// Helper functions for CRUD operations
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = { db, dbAll, dbRun, dbGet };
