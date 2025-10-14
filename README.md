# Project Xavier - Workflow Management Platform

A comprehensive, full-featured workflow management and automation platform based on the Bika.ai workspace architecture. Built with React, Node.js, Express, and SQLite.

## 🚀 Features

### Core Modules

- **📊 Dashboard** - Real-time overview of all workflows, projects, and activities
- **🔄 Workflow Navigator** - Manage and track workflows with status, priority, and assignments
- **📁 Portfolio Sync Studio** - Sync and monitor project portfolios with progress tracking
- **💡 Innovation Flow** - Track innovation opportunities and trends
- **🌙 Dream Journal** - Record and analyze dreams with symbols and sentiment
- **❤️ Health Metrics** - Track health and wellness data
- **💰 Money Moves** - Financial transaction tracking and management
- **⚡ Automations** - Scheduled and event-driven workflow automations
- **🤖 Agents** - AI-powered automation agents

### Database Tables

All tables from the Project Xavier specification:
- workflow_navigator
- portfolio_sync
- innovation_flow
- backend_insight
- dream_journal
- scrobble_history
- xavier_lore
- health_metrics
- money_moves
- system_config
- automations
- agents
- activity_log

### Automation System

- **Trigger Types**: record_created, record_updated, scheduled
- **Actions**: update_record, log, notify, call_agent, create_record
- **Cron Scheduling**: Support for time-based automation triggers
- **Agent Integration**: Connect AI agents to automation workflows

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Automation**: node-cron, js-yaml
- **Styling**: Custom CSS with CSS variables

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development servers (both frontend and backend)
npm run dev

# Or start separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 🏗️ Project Structure

```
project-xavier/
├── server/
│   ├── index.js          # Express server and API endpoints
│   ├── database.js       # SQLite database initialization
│   ├── automations.js    # Automation engine
│   └── xavier.db         # SQLite database file
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx
│   │   ├── WorkflowNavigator.jsx
│   │   ├── PortfolioSync.jsx
│   │   ├── InnovationFlow.jsx
│   │   ├── DreamJournal.jsx
│   │   ├── HealthMetrics.jsx
│   │   ├── MoneyMoves.jsx
│   │   ├── Automations.jsx
│   │   └── Agents.jsx
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🔌 API Endpoints

### Generic CRUD for all tables:
- `GET /api/:table` - Get all records
- `GET /api/:table/:id` - Get single record
- `POST /api/:table` - Create new record
- `PUT /api/:table/:id` - Update record
- `DELETE /api/:table/:id` - Delete record

### Dashboard:
- `GET /api/dashboard/stats` - Get dashboard statistics

## ⚙️ Configuration

### Database Schema

All tables are automatically created on first run. Primary keys:
- workflow_navigator: workflow_id
- portfolio_sync: project_id
- innovation_flow: opportunity_id
- dream_journal: dream_id
- health_metrics: metric_id
- money_moves: transaction_id
- automations: automation_id
- agents: agent_id

### Automation Configuration

Automations are stored in the `automations` table with:
- `trigger_type`: scheduled, record_created, record_updated
- `trigger_config`: JSON configuration (e.g., schedule time, conditions)
- `actions`: JSON array of actions to execute

Example scheduled automation:
```json
{
  "trigger_type": "scheduled",
  "trigger_config": {
    "time": "Sunday 17:00"
  },
  "actions": [
    {
      "type": "log",
      "message": "Weekly summary generated"
    }
  ]
}
```

## 🎨 Customization

### Styling

All colors are defined as CSS variables in `src/index.css`:
- `--primary`: Main brand color
- `--secondary`: Secondary accent color
- `--success`, `--warning`, `--danger`: Status colors
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`: Background colors
- `--text-primary`, `--text-secondary`: Text colors

### Adding New Tables

1. Add table schema in `server/database.js`
2. Add table name to the `tables` array in `server/index.js`
3. Create a React component in `src/components/`
4. Add navigation item in `src/App.jsx`

## 📝 Sample Data

To add sample data, use the API endpoints or connect to the SQLite database directly:

```bash
sqlite3 server/xavier.db
```

Then run SQL INSERT statements or use the web interface.

## 🚧 Development

### Running Tests
```bash
# Add tests here
npm test
```

### Building for Production
```bash
npm run build
npm start
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for Project Xavier
