const { dbRun } = require('./database');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Sample Workflows
    await dbRun(
      `INSERT OR IGNORE INTO workflow_navigator 
       (workflow_id, name, description, status, priority, assigned_to, deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['wf-001', 'Website Redesign', 'Complete overhaul of company website', 'Active', 5, 'Design Team', '2025-12-31']
    );

    await dbRun(
      `INSERT OR IGNORE INTO workflow_navigator 
       (workflow_id, name, description, status, priority, assigned_to, deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['wf-002', 'API Integration', 'Integrate third-party payment gateway', 'Planned', 8, 'Backend Team', '2025-11-15']
    );

    await dbRun(
      `INSERT OR IGNORE INTO workflow_navigator 
       (workflow_id, name, description, status, priority, assigned_to, deadline) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['wf-003', 'Mobile App Launch', 'Launch iOS and Android apps', 'Review', 9, 'Mobile Team', '2025-10-30']
    );

    // Sample Projects
    await dbRun(
      `INSERT OR IGNORE INTO portfolio_sync 
       (project_id, project_name, owner, progress, sync_status, review_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['prj-001', 'E-commerce Platform', 'Tech Lead', 75, 'Synced', '2025-11-01']
    );

    await dbRun(
      `INSERT OR IGNORE INTO portfolio_sync 
       (project_id, project_name, owner, progress, sync_status, review_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['prj-002', 'Customer Portal', 'Product Manager', 45, 'Queued', '2025-11-15']
    );

    // Sample Innovations
    await dbRun(
      `INSERT OR IGNORE INTO innovation_flow 
       (opportunity_id, title, description, trend_score, category, impact, owner, review_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['inn-001', 'AI-Powered Search', 'Implement machine learning for better search results', 85, 'Technology', 9, 'AI Team', 'Under Review']
    );

    await dbRun(
      `INSERT OR IGNORE INTO innovation_flow 
       (opportunity_id, title, description, trend_score, category, impact, owner, review_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['inn-002', 'Voice Interface', 'Add voice commands to mobile app', 72, 'UX', 7, 'UX Team', 'New']
    );

    // Sample Dreams
    await dbRun(
      `INSERT OR IGNORE INTO dream_journal 
       (dream_id, date, title, description, symbols, sentiment) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['drm-001', '2025-10-01', 'Flying Dream', 'I was flying over mountains and oceans', 'freedom, adventure, sky', 'positive']
    );

    await dbRun(
      `INSERT OR IGNORE INTO dream_journal 
       (dream_id, date, title, description, symbols, sentiment) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['drm-002', '2025-10-05', 'Lost in Forest', 'Wandering through a dense forest trying to find my way', 'confusion, nature, journey', 'neutral']
    );

    // Sample Health Metrics
    await dbRun(
      `INSERT OR IGNORE INTO health_metrics 
       (metric_id, date, metric_type, value, unit, source) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['hm-001', '2025-10-14', 'Weight', 75.5, 'kg', 'Smart Scale']
    );

    await dbRun(
      `INSERT OR IGNORE INTO health_metrics 
       (metric_id, date, metric_type, value, unit, source) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['hm-002', '2025-10-14', 'Steps', 8542, 'steps', 'Fitness Tracker']
    );

    await dbRun(
      `INSERT OR IGNORE INTO health_metrics 
       (metric_id, date, metric_type, value, unit, source) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['hm-003', '2025-10-14', 'Heart Rate', 72, 'bpm', 'Fitness Tracker']
    );

    // Sample Money Moves
    await dbRun(
      `INSERT OR IGNORE INTO money_moves 
       (transaction_id, date, type, amount, category, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['mn-001', '2025-10-01', 'income', 5000, 'Salary', 'Monthly salary payment', 'Completed']
    );

    await dbRun(
      `INSERT OR IGNORE INTO money_moves 
       (transaction_id, date, type, amount, category, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['mn-002', '2025-10-05', 'expense', 1200, 'Rent', 'Monthly rent payment', 'Completed']
    );

    await dbRun(
      `INSERT OR IGNORE INTO money_moves 
       (transaction_id, date, type, amount, category, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['mn-003', '2025-10-10', 'expense', 250, 'Groceries', 'Weekly grocery shopping', 'Completed']
    );

    // Sample Automations
    await dbRun(
      `INSERT OR IGNORE INTO automations 
       (automation_id, name, target_table, trigger_type, trigger_config, actions, enabled) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'auto-001',
        'Weekly Workflow Summary',
        'workflow_navigator',
        'scheduled',
        JSON.stringify({ time: 'Sunday 17:00' }),
        JSON.stringify([
          { type: 'log', message: 'Weekly summary generated' },
          { type: 'notify', message: 'Your weekly workflow summary is ready' }
        ]),
        1
      ]
    );

    await dbRun(
      `INSERT OR IGNORE INTO automations 
       (automation_id, name, target_table, trigger_type, trigger_config, actions, enabled) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'auto-002',
        'Status Change Notification',
        'workflow_navigator',
        'record_updated',
        JSON.stringify({ conditions: [{ field: 'status', changed: true }] }),
        JSON.stringify([
          { type: 'log', message: 'Status updated' },
          { type: 'notify', message: 'Workflow status has changed' }
        ]),
        1
      ]
    );

    // Sample Agents
    await dbRun(
      `INSERT OR IGNORE INTO agents 
       (agent_id, name, description, logic, enabled) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'agent-001',
        'Workflow Prioritizer',
        'Automatically adjusts workflow priorities based on deadlines and status',
        'If status is "Planned" and deadline is within 7 days, set priority to high.\nIf progress > 80%, suggest status change to "Review".',
        1
      ]
    );

    await dbRun(
      `INSERT OR IGNORE INTO agents 
       (agent_id, name, description, logic, enabled) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'agent-002',
        'Dream Interpreter',
        'Analyzes dream journal entries to extract themes and symbols',
        'Analyze description to identify key symbols.\nDetermine sentiment (positive/negative/neutral).\nSuggest interpretations based on common dream symbolism.',
        1
      ]
    );

    await dbRun(
      `INSERT OR IGNORE INTO agents 
       (agent_id, name, description, logic, enabled) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'agent-003',
        'Budget Advisor',
        'Monitors spending patterns and provides financial insights',
        'Track spending by category.\nAlert when monthly budget limits are approached.\nSuggest savings opportunities based on spending patterns.',
        1
      ]
    );

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seeding
seedDatabase();
