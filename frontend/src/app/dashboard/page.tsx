'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await api.post('/tasks', { title: newTaskTitle });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Optimistic update
    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: newStatus as 'pending' | 'completed' } : t
    );
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task', error);
      // Revert on error
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const updatedTasks = tasks.filter((t) => t._id !== id);
    setTasks(updatedTasks);

    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Failed to delete task', error);
      // Revert
      fetchTasks();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading tasks...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Task Tracker</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <form onSubmit={createTask} className="flex gap-4">
            <Input
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No tasks yet. Enjoy your day!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white p-4 rounded-lg shadow-sm border transition-all duration-200 flex items-center justify-between group ${
                  task.status === 'completed' ? 'opacity-75 bg-gray-50' : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleStatus(task)}
                    className={`transition-colors duration-200 ${
                      task.status === 'completed' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <span
                    className={`text-lg transition-all duration-200 ${
                      task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task._id)}>
                    <Trash2 className="w-5 h-5 text-red-400 hover:text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
