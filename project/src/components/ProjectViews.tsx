import React, { useState } from 'react';
import { Calendar, List, Table, Users2, ListTodo } from 'lucide-react';
import type { ProjectCard } from './Projects';
import Task from './Projects';

type ViewMode = 'table' | 'calendar' | 'list';

interface ProjectViewsProps {
  projects: ProjectCard[];
}

const ProjectViews: React.FC<ProjectViewsProps> = ({ projects }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const renderTableView = () => (
    <div className="overflow-x-auto glass-card rounded-xl p-6">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left p-3 text-white/60 font-medium">Title</th>
            <th className="text-left p-3 text-white/60 font-medium hidden md:table-cell">Description</th>
            <th className="text-left p-3 text-white/60 font-medium">Status</th>
            <th className="text-left p-3 text-white/60 font-medium">Due Date</th>
            <th className="text-left p-3 text-white/60 font-medium">Assignees</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
              <td className="p-5">
                <div className="flex flex-col gap-1.5">
                  <span className="text-white font-semibold text-base tracking-tight">{project.title}</span>
                  <span className="text-white/60 text-sm md:hidden line-clamp-2 leading-relaxed">{project.description}</span>
                </div>
              </td>
              <td className="p-5 text-white/80 hidden md:table-cell line-clamp-2 leading-relaxed">{project.description}</td>
              <td className="p-5">
                <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ').split(' ')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </span>
              </td>
              <td className="p-5 text-white/80 whitespace-nowrap">
                {new Date(project.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </td>
              <td className="p-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-white/80" />
                  </div>
                  <span className="text-white/80 font-medium">{project.assignees}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCalendarView = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const startingDayIndex = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const totalDays = Math.ceil((startingDayIndex + daysInMonth) / 7) * 7;

    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-white/60 font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: totalDays }).map((_, index) => {
            const dayNumber = index - startingDayIndex + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            const currentDate = new Date(today.getFullYear(), today.getMonth(), dayNumber);
            const projectsForDay = projects.filter((project) => {
              if (!project.dueDate) return false;
              const projectDate = new Date(project.dueDate);
              return (
                projectDate.getDate() === dayNumber &&
                projectDate.getMonth() === today.getMonth() &&
                projectDate.getFullYear() === today.getFullYear()
              );
            });

            return (
              <div
                key={index}
                className={`p-2 min-h-[100px] border border-white/10 rounded transition-opacity
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${currentDate.toDateString() === today.toDateString() ? 'bg-white/5' : ''}`}
              >
                <div className="text-white/60 mb-2">
                  {isCurrentMonth ? dayNumber : ''}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {projectsForDay.map((project) => (
                    <div
                      key={project.id}
                      className={`text-xs p-1.5 rounded ${getStatusColor(project.status)}`}
                      title={project.title}
                    >
                      {project.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="glass-card rounded-xl p-6 hover:bg-white/5 transition-colors">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/60">{project.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <span className="block text-white/60 mb-1">Due Date</span>
                {new Date(project.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Users2 className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <span className="block text-white/60 mb-1">Assignees</span>
                {project.assignees} members
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <span className="block text-white/60 mb-1">Tasks</span>
                {project.tasks.length} tasks ({project.tasks.filter((task: Task) => task.completed).length} completed)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getStatusColor = (status: ProjectCard['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-amber-500/30 text-amber-300 status-glow';
      case 'todo':
        return 'bg-purple-500/30 text-purple-300 status-glow';
      case 'in-progress':
        return 'bg-blue-500/30 text-blue-300 status-glow';
      case 'client-review':
        return 'bg-indigo-500/30 text-indigo-300 status-glow';
      case 'completed':
        return 'bg-emerald-500/30 text-emerald-300 status-glow';
      default:
        return 'bg-gray-500/30 text-gray-300 status-glow';
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Table className="w-4 h-4" />
          Table
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Calendar className="w-4 h-4" />
          Calendar
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <List className="w-4 h-4" />
          List
        </button>
      </div>
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'calendar' && renderCalendarView()}
      {viewMode === 'list' && renderListView()}
    </div>
  );
};

export default ProjectViews;