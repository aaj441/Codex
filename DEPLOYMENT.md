# 🚀 Project Xavier - Deployment Information

## Live Application URLs

### Frontend (React App)
**URL:** https://3000-iz0ngtl5vlh4eebrwa84a-18e660f9.sandbox.novita.ai
- Modern React interface with all modules
- Interactive dashboard
- Real-time data visualization
- Full CRUD operations

### Backend API
**URL:** https://5000-iz0ngtl5vlh4eebrwa84a-18e660f9.sandbox.novita.ai
- RESTful API endpoints
- SQLite database
- Automation engine
- Agent system

## 📊 Available Modules

1. **Dashboard** - Overview of all workflows, projects, and activities
2. **Workflow Navigator** - Manage workflows with status tracking
3. **Portfolio Sync** - Project portfolio management
4. **Innovation Flow** - Track innovation opportunities
5. **Dream Journal** - Dream recording and analysis
6. **Health Metrics** - Health and wellness tracking
7. **Money Moves** - Financial transaction management
8. **Automations** - Workflow automation configuration
9. **Agents** - AI-powered automation agents

## 🎯 Sample Data Included

The database has been pre-populated with sample data:
- 3 workflows (Website Redesign, API Integration, Mobile App Launch)
- 2 projects (E-commerce Platform, Customer Portal)
- 2 innovations (AI-Powered Search, Voice Interface)
- 2 dreams with analysis
- 3 health metrics
- 3 financial transactions
- 2 automations (scheduled and event-driven)
- 3 AI agents (Workflow Prioritizer, Dream Interpreter, Budget Advisor)

## 🔧 API Endpoints

### Generic CRUD (works for all tables)
- `GET /api/:table` - Get all records
- `GET /api/:table/:id` - Get single record  
- `POST /api/:table` - Create new record
- `PUT /api/:table/:id` - Update record
- `DELETE /api/:table/:id` - Delete record

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Tables
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

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Seed database with sample data
node server/seed.js

# Run both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

## 📁 Project Structure

```
project-xavier/
├── server/
│   ├── index.js          # Express server
│   ├── database.js       # Database setup
│   ├── automations.js    # Automation engine
│   ├── seed.js           # Sample data
│   └── xavier.db         # SQLite database
├── src/
│   ├── components/       # React components
│   ├── App.jsx          # Main app
│   ├── main.jsx         # Entry point
│   └── index.css        # Styles
└── package.json
```

## 🎨 Key Features

### Automation System
- **Scheduled Triggers**: Run automations on a cron schedule
- **Event Triggers**: Execute on record create/update
- **Multiple Actions**: log, notify, update_record, call_agent, create_record

### Agent System
- **Workflow Prioritizer**: Adjusts priorities based on deadlines
- **Dream Interpreter**: Analyzes dream patterns and symbols
- **Budget Advisor**: Monitors spending and provides insights

### Dashboard Widgets
- Total workflows count
- Active workflows tracking
- Project progress visualization
- Innovation metrics
- Recent activity log
- Financial summaries

## 📝 Adding New Data

### Via Web Interface
1. Navigate to any module
2. Click "Add" button
3. Fill in the form
4. Submit

### Via API
```bash
curl -X POST https://5000-iz0ngtl5vlh4eebrwa84a-18e660f9.sandbox.novita.ai/api/workflow_navigator \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "wf-004",
    "name": "New Workflow",
    "description": "Description here",
    "status": "Planned",
    "priority": 5
  }'
```

## 🔐 Database

- **Type**: SQLite3
- **Location**: `server/xavier.db`
- **Tables**: 13 tables (see README.md for details)
- **Pre-seeded**: Yes, with sample data

## 📚 Documentation

See `README.md` for:
- Complete feature list
- API documentation
- Database schema details
- Configuration options
- Customization guide

## 🎯 Next Steps

1. **Explore the Dashboard**: Visit the frontend URL to see all features
2. **Try CRUD Operations**: Add, edit, and delete records in any module
3. **Check Automations**: View configured automations and agents
4. **Add Custom Data**: Create your own workflows, projects, and more
5. **Customize**: Modify colors, add new tables, create custom automations

## 🔗 Repository

**GitHub**: https://github.com/aaj2127/Codex.git
**Branch**: main
**Commit**: Initial release with all features

---

Built with React, Node.js, Express, and SQLite ❤️
