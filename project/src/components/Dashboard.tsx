import React from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock3
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { icon: BarChart3, label: 'Total Projects', value: '24', color: 'from-blue-400 to-indigo-400' },
    { icon: Users, label: 'Active Clients', value: '18', color: 'from-emerald-400 to-teal-400' },
    { icon: Clock, label: 'Hours Logged', value: '164', color: 'from-purple-400 to-fuchsia-400' },
    { icon: TrendingUp, label: 'Revenue', value: '$28,429', color: 'from-amber-400 to-orange-400' },
  ];

  const projects = [
    { name: 'Website Redesign', client: 'Tech Corp', status: 'active' },
    { name: 'Mobile App Dev', client: 'StartUp Inc', status: 'on-hold' },
    { name: 'CRM Integration', client: 'Global Ltd', status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/30 text-blue-300 status-glow';
      case 'completed':
        return 'bg-emerald-500/30 text-emerald-300 status-glow';
      case 'on-hold':
        return 'bg-amber-500/30 text-amber-300 status-glow';
      default:
        return '';
    }
  };

  const getStatusGlowColor = (status: string) => {
    switch (status) {
      case 'active':
        return '--glow-color: rgba(59, 130, 246, 0.35);';
      case 'completed':
        return '--glow-color: rgba(16, 185, 129, 0.35);';
      case 'on-hold':
        return '--glow-color: rgba(245, 158, 11, 0.35);';
      default:
        return '';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
          Dashboard
        </h1>
        <p className="text-white/60">Welcome back! Here's your project overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-6">
            <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white/60 text-sm mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
          Recent Projects
        </h2>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.name} className="glass-card rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white/90">{project.name}</h3>
                <span 
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  style={{ [getStatusGlowColor(project.status)]: '' }}
                >
                  {project.status === 'active' && (
                    <div className="flex items-center gap-1">
                      <Clock3 className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  )}
                  {project.status === 'completed' && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completed</span>
                    </div>
                  )}
                  {project.status === 'on-hold' && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>On Hold</span>
                    </div>
                  )}
                </span>
              </div>
              <p className="text-white/60 text-sm">{project.client}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;