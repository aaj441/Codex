const cron = require('node-cron');
const yaml = require('js-yaml');
const { dbAll, dbRun } = require('./database');

const activeAutomations = new Map();

async function initializeAutomations() {
  console.log('🤖 Initializing automation system...');
  
  try {
    const automations = await dbAll('SELECT * FROM automations WHERE enabled = 1');
    
    for (const automation of automations) {
      registerAutomation(automation);
    }
    
    console.log(`✅ Loaded ${automations.length} automations`);
  } catch (error) {
    console.error('Error initializing automations:', error);
  }
}

function registerAutomation(automation) {
  try {
    const config = JSON.parse(automation.trigger_config || '{}');
    const actions = JSON.parse(automation.actions || '[]');
    
    if (automation.trigger_type === 'scheduled' && config.time) {
      const cronPattern = convertTimeToCron(config.time);
      const task = cron.schedule(cronPattern, async () => {
        console.log(`⏰ Running scheduled automation: ${automation.name}`);
        await executeActions(actions, automation.target_table, {});
      });
      
      activeAutomations.set(automation.automation_id, task);
      console.log(`📅 Scheduled automation: ${automation.name} at ${config.time}`);
    }
  } catch (error) {
    console.error(`Error registering automation ${automation.name}:`, error);
  }
}

async function executeActions(actions, table, context) {
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'update_record':
          if (context.record_id) {
            const updates = Object.keys(action.fields)
              .map(key => `${key} = ?`)
              .join(', ');
            const values = [...Object.values(action.fields), context.record_id];
            const idColumn = getIdColumn(table);
            await dbRun(
              `UPDATE ${table} SET ${updates} WHERE ${idColumn} = ?`,
              values
            );
          }
          break;
          
        case 'log':
          console.log(`📝 ${action.message}`, context);
          await dbRun(
            `INSERT INTO activity_log (action, table_name, record_id, details) 
             VALUES (?, ?, ?, ?)`,
            ['AUTOMATION', table, context.record_id || '', action.message]
          );
          break;
          
        case 'notify':
          // Placeholder for notification system
          console.log(`🔔 Notification: ${action.message}`, context);
          break;
          
        case 'call_agent':
          // Placeholder for agent execution
          console.log(`🤖 Calling agent: ${action.agent}`, context);
          await executeAgent(action.agent, table, context);
          break;
          
        case 'create_record':
          if (action.target_table && action.fields) {
            const columns = Object.keys(action.fields).join(', ');
            const placeholders = Object.keys(action.fields).map(() => '?').join(', ');
            const values = Object.values(action.fields);
            await dbRun(
              `INSERT INTO ${action.target_table} (${columns}) VALUES (${placeholders})`,
              values
            );
          }
          break;
          
        default:
          console.log(`⚠️  Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
    }
  }
}

async function executeAgent(agentName, table, context) {
  try {
    const agent = await dbAll(
      'SELECT * FROM agents WHERE name = ? AND enabled = 1 LIMIT 1',
      [agentName]
    );
    
    if (agent.length > 0) {
      const agentLogic = agent[0].logic;
      console.log(`🧠 Executing agent logic for ${agentName}`);
      // Here you would implement actual agent logic execution
      // For now, just log it
      console.log(agentLogic);
    }
  } catch (error) {
    console.error(`Error executing agent ${agentName}:`, error);
  }
}

function convertTimeToCron(timeString) {
  // Convert "Sunday 17:00" to cron pattern "0 17 * * 0"
  // Convert "03:00" to "0 3 * * *"
  const parts = timeString.split(' ');
  
  if (parts.length === 2) {
    const [day, time] = parts;
    const [hour, minute] = time.split(':');
    const dayMap = {
      'Sunday': '0', 'Monday': '1', 'Tuesday': '2', 'Wednesday': '3',
      'Thursday': '4', 'Friday': '5', 'Saturday': '6'
    };
    return `${minute} ${hour} * * ${dayMap[day] || '*'}`;
  } else {
    const [hour, minute] = parts[0].split(':');
    return `${minute} ${hour} * * *`;
  }
}

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

// Trigger automation on record events
async function triggerOnRecordCreated(table, record) {
  const automations = await dbAll(
    `SELECT * FROM automations 
     WHERE target_table = ? 
     AND trigger_type = 'record_created' 
     AND enabled = 1`,
    [table]
  );
  
  for (const automation of automations) {
    const actions = JSON.parse(automation.actions || '[]');
    await executeActions(actions, table, { record, record_id: record[getIdColumn(table)] });
  }
}

async function triggerOnRecordUpdated(table, record, oldRecord) {
  const automations = await dbAll(
    `SELECT * FROM automations 
     WHERE target_table = ? 
     AND trigger_type = 'record_updated' 
     AND enabled = 1`,
    [table]
  );
  
  for (const automation of automations) {
    const config = JSON.parse(automation.trigger_config || '{}');
    const conditions = config.conditions || [];
    
    // Check if conditions are met
    let shouldTrigger = conditions.length === 0;
    for (const condition of conditions) {
      if (condition.changed && oldRecord[condition.field] !== record[condition.field]) {
        shouldTrigger = true;
        break;
      }
    }
    
    if (shouldTrigger) {
      const actions = JSON.parse(automation.actions || '[]');
      await executeActions(actions, table, { record, oldRecord, record_id: record[getIdColumn(table)] });
    }
  }
}

module.exports = {
  initializeAutomations,
  registerAutomation,
  triggerOnRecordCreated,
  triggerOnRecordUpdated,
  executeActions,
  executeAgent
};
