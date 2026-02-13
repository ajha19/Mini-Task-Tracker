'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, Trash2, CheckCircle, Circle, Calendar, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  createdAt: string;
}

type FilterType = 'all' | 'pending' | 'completed';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

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
      const res = await api.post('/tasks', { 
        title: newTaskTitle,
        dueDate: newTaskDate || undefined
      });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDate('');
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updatedTasks = tasks.map((t) =>
      t._id === task._id ? { ...t, status: newStatus as 'pending' | 'completed' } : t
    );
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task', error);
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter((t) => t._id !== id);
    setTasks(updatedTasks);

    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error('Failed to delete task', error);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Task Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                Welcome, {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Create Task Card */}
        <Card className="shadow-md border-none ring-1 ring-black/5">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTask} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
          <div className="flex bg-card p-1 rounded-lg border shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'pending' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'completed' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
                <p className="text-muted-foreground mt-1">
                  {filter === 'all' ? "You haven't created any tasks yet." : `You have no ${filter} tasks.`}
                </p>
              </motion.div>
            ) : (
              filteredTasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                  className="group"
                >
                  <Card className={`transition-all duration-200 hover:shadow-md ${task.status === 'completed' ? 'bg-muted/30' : 'bg-card'}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <button
                        onClick={() => toggleStatus(task)}
                        className={`flex-shrink-0 transition-colors duration-200 ${
                          task.status === 'completed' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-base font-medium truncate transition-all duration-200 ${
                          task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          {task.dueDate && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          <Badge variant={task.status === 'completed' ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0 h-5">
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteTask(task._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
