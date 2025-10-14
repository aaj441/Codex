import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import WorkflowNavigator from './components/WorkflowNavigator';
import PortfolioSync from './components/PortfolioSync';
import InnovationFlow from './components/InnovationFlow';
import DreamJournal from './components/DreamJournal';
import HealthMetrics from './components/HealthMetrics';
import MoneyMoves from './components/MoneyMoves';
import Automations from './components/Automations';
import Agents from './components/Agents';
import { 
  LayoutDashboard, 
  Workflow, 
  FolderKanban, 
  Lightbulb, 
  Moon,
  Heart,
  DollarSign,
  Zap,
  Bot,
  Activity
} from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflow Navigator', icon: Workflow },
    { id: 'portfolio', label: 'Portfolio Sync', icon: FolderKanban },
    { id: 'innovation', label: 'Innovation Flow', icon: Lightbulb },
    { id: 'dreams', label: 'Dream Journal', icon: Moon },
    { id: 'health', label: 'Health Metrics', icon: Heart },
    { id: 'money', label: 'Money Moves', icon: DollarSign },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'agents', label: 'Agents', icon: Bot },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'workflows':
        return <WorkflowNavigator />;
      case 'portfolio':
        return <PortfolioSync />;
      case 'innovation':
        return <InnovationFlow />;
      case 'dreams':
        return <DreamJournal />;
      case 'health':
        return <HealthMetrics />;
      case 'money':
        return <MoneyMoves />;
      case 'automations':
        return <Automations />;
      case 'agents':
        return <Agents />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Activity size={32} />
            <span>Project Xavier</span>
          </div>
        </div>
        
        <nav>
          <div className="nav-section">
            <h3 className="nav-title">Main</h3>
            <ul className="nav-items">
              {navigation.slice(0, 1).map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-title">Modules</h3>
            <ul className="nav-items">
              {navigation.slice(1, 7).map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="nav-section">
            <h3 className="nav-title">System</h3>
            <ul className="nav-items">
              {navigation.slice(7).map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
