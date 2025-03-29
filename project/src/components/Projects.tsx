import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus,
  Users2,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  CheckSquare,
  Square,
  ListTodo
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  assignees: number;
  status: 'planning' | 'todo' | 'in-progress' | 'client-review' | 'completed';
  dueDate: string;
  tasks: Task[];
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectCard[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Redesign company website with modern UI',
      assignees: 3,
      status: 'todo',
      dueDate: '2024-02-15',
      tasks: [
        { id: '1-1', title: 'Design homepage mockup', completed: false },
        { id: '1-2', title: 'Create component library', completed: true },
        { id: '1-3', title: 'Implement responsive layout', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Develop iOS and Android apps',
      assignees: 4,
      status: 'in-progress',
      dueDate: '2024-03-01',
      tasks: [
        { id: '2-1', title: 'Setup development environment', completed: true },
        { id: '2-2', title: 'Design user authentication flow', completed: false },
        { id: '2-3', title: 'Implement API integration', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Database Migration',
      description: 'Migrate from MySQL to PostgreSQL',
      assignees: 2,
      status: 'completed',
      dueDate: '2024-01-30',
      tasks: [
        { id: '3-1', title: 'Data backup', completed: true },
        { id: '3-2', title: 'Schema migration', completed: true },
        { id: '3-3', title: 'Testing and verification', completed: true }
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectCard | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectCard | null>(null);
  const [formData, setFormData] = useState<Omit<ProjectCard, 'id' | 'tasks'>>({
    title: '',
    description: '',
    assignees: 1,
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignees: 1,
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setEditingProject(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...formData, id: editingProject.id, tasks: editingProject.tasks }
          : p
      ));
    } else {
      const newProject = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        tasks: []
      };
      setProjects([...projects, newProject]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (project: ProjectCard) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      assignees: project.assignees,
      status: project.status,
      dueDate: project.dueDate || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setDeleteConfirmation(null);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    // Update the selected project if it's open
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  const addTask = (projectId: string) => {
    if (!newTask.trim()) return;

    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [
            ...project.tasks,
            {
              id: Math.random().toString(36).substr(2, 9),
              title: newTask.trim(),
              completed: false
            }
          ]
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    setNewTask('');
    
    // Update the selected project if it's open
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  const deleteTask = (projectId: string, taskId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    
    // Update the selected project if it's open
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  };

  const getColumnProjects = (status: 'planning' | 'todo' | 'in-progress' | 'client-review' | 'completed') => {
    return projects.filter(project => project.status === status);
  };

  const getStatusColor = (status: 'planning' | 'todo' | 'in-progress' | 'client-review' | 'completed') => {
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
    }
  };

  const getStatusGlowColor = (status: 'todo' | 'in-progress' | 'client-review' | 'completed') => {
    switch (status) {
      case 'todo':
        return '--glow-color: rgba(168, 85, 247, 0.35);';
      case 'in-progress':
        return '--glow-color: rgba(59, 130, 246, 0.35);';
      case 'client-review':
        return '--glow-color: rgba(129, 140, 248, 0.35);';
      case 'completed':
        return '--glow-color: rgba(16, 185, 129, 0.35);';
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const project = projects.find(p => p.id === draggableId);
    if (!project) return;

    const newProjects = projects.filter(p => p.id !== draggableId);
    const updatedProject = {
      ...project,
      status: destination.droppableId as 'planning' | 'todo' | 'in-progress' | 'client-review' | 'completed'
    };

    newProjects.splice(destination.index, 0, updatedProject);
    setProjects(newProjects);
  };

  const ProjectCard = ({ project, index }: { project: ProjectCard; index: number }) => (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="glass-card rounded-lg p-4 mb-[10px] cursor-pointer relative min-h-[120px] w-full"
          style={{ ...provided.draggableProps.style }}
          onClick={() => setSelectedProject(project)}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white/90 text-base line-clamp-2">{project.title}</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(project);
                }}
                className="text-white/40 hover:text-white/60 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteConfirmation(project.id);
                }}
                className="text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/60 text-sm">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/60">{project.assignees}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );

  const Column = ({ title, status }: { title: string; status: 'todo' | 'in-progress' | 'completed' }) => {
    const headerColors = {
      planning: 'from-amber-400 via-orange-400 to-red-400',
      todo: 'from-purple-400 via-fuchsia-400 to-pink-400',
      'in-progress': 'from-blue-400 via-cyan-400 to-teal-400',
      'client-review': 'from-indigo-400 via-violet-400 to-purple-400',
      completed: 'from-emerald-400 via-green-400 to-teal-400'
    };
    

    return (
      <div className="w-full min-w-[300px] max-w-[400px] mx-6 my-5">
        <div className="flex items-center justify-between mb-4" style={{ display: 'flex' , margin: '20px'}}>
          <div className="flex items-center gap-3">
            <h2 className={`text-transparent bg-clip-text bg-gradient-to-r font-bold text-xl ${headerColors[status]}`}>
              {title}
            </h2>
            <span className="glass-effect px-2 py-0.5 rounded-full text-sm text-white/70">
              {getColumnProjects(status).length}
            </span>
          </div>
          <button
            onClick={() => {
              resetForm();
              setFormData({ ...formData, status });
              setIsModalOpen(true);
            }}
            className={`glass-effect p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 flex items-center justify-center ${headerColors[status]}`}
            title="Add new project"
          >
            <Plus size={16} />
          </button>
        </div>
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div className="flex flex-col">
              <div
                ref={provided?.innerRef}
                {...provided.droppableProps}
                className={`glass-effect min-h-[calc(100vh-220px)] p-4 rounded-xl transition-colors ${
                  snapshot.isDraggingOver ? 'bg-white/10' : ''
                }`}
              >
                {getColumnProjects(status).map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => {
                    resetForm();
                    setFormData({ ...formData, status });
                    setIsModalOpen(true);
                  }}
                  className={`glass-effect w-full p-3 mt-4 rounded-lg hover:bg-white/10 transition-colors text-white/60 flex items-center justify-center gap-2`}
                >
                  <Plus size={16} />
              <span>Add Card</span>
                </button>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="p-8 h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Projects
          </h1>
          <p className="text-white/60">Manage and track project progress</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-5" style={{ display: 'flex', marginLeft: '-60px', overflow: 'hidden' }}>
          <div className="">
            <Column title="To Do" status="todo" />
          </div>
          <div className="">
            <Column title="In Progress" status="in-progress" />
          </div>
          <div className="">
            <Column title="Client Review" status="in-progress" />
          </div>
          <div className="">
            <Column title="Completed" status="completed" />
          </div>
        </div>
      </DragDropContext>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-white/70 mb-6">{selectedProject.description}</p>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tasks</h3>
                <span className="text-white/60">
                  {selectedProject.tasks.filter(t => t.completed).length}/{selectedProject.tasks.length} completed
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {selectedProject.tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between glass-card p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const updatedTask = { ...task, completed: !task.completed };
                          const updatedProject = {
                            ...selectedProject,
                            tasks: selectedProject.tasks.map(t => 
                              t.id === task.id ? updatedTask : t
                            )
                          };
                          setSelectedProject(updatedProject);
                          toggleTask(selectedProject.id, task.id);
                        }}
                        className={`flex items-center justify-center w-6 h-6 rounded transition-colors ${task.completed ? 'text-green-400' : 'text-white/60 hover:text-white/80'} cursor-pointer`}
                        aria-label={`Mark task ${task.completed ? 'incomplete' : 'complete'}`}
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <span className={`${task.completed ? 'line-through text-white/40' : 'text-white/90'} transition-colors`}>
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(selectedProject.id, task.id)}
                      className="text-white/40 hover:text-red-400 transition-colors"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 bg-white/10 rounded-lg border border-white/20 p-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && addTask(selectedProject.id)}
                />
                <button
                  onClick={() => addTask(selectedProject.id)}
                  disabled={!newTask.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">Delete Project</h2>
            </div>
            <p className="text-white/70 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-lg text-white/60 hover:text-white/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(deleteConfirmation)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2" htmlFor="title">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2" htmlFor="assignees">
                  Team Members
                </label>
                <input
                  type="number"
                  id="assignees"
                  min="1"
                  value={formData.assignees}
                  onChange={(e) => setFormData({ ...formData, assignees: parseInt(e.target.value) })}
                  className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2" htmlFor="dueDate">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-white/10 rounded-lg border border-white/20 p-3 text-white focus:outline-none focus:border-blue-400 transition-colors"
                >
                  <option value="todo" className="bg-gray-900">Todo</option>
                  <option value="in-progress" className="bg-gray-900">In Progress</option>
                  <option value="client-review" className="bg-gray-900">Client Review</option>
                  <option value="completed" className="bg-gray-900">Completed</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20"
                >
                  <Check className="w-4 h-4" />
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;