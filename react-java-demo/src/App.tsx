import React, { useState, useEffect } from 'react';
import { userApi } from './services/api';
import { User } from './types';
import UserForm from './components/UserForm';
import UserList  from './components/UserList';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userApi.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (user: User) => {
    setLoading(true);
    setError('');
    try {
      const response = await userApi.createUser(user);
      if (response.success) {
        setUsers(prev => [...prev, response.data]);
        setSuccess('User created successfully!');
        setShowForm(false);
        clearMessages();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (user: User) => {
    if (!editingUser?.id) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await userApi.updateUser(editingUser.id, user);
      if (response.success) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? response.data : u));
        setSuccess('User updated successfully!');
        setEditingUser(null);
        clearMessages();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await userApi.deleteUser(id);
      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        setSuccess('User deleted successfully!');
        clearMessages();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
    setError('');
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="app-header">
          <h1>User Management System</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="primary-btn"
            disabled={loading}
          >
            Add New User
          </button>
        </header>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={() => setSuccess('')} className="close-btn">×</button>
          </div>
        )}

        <main className="app-main">
          {showForm && (
            <div className="form-container">
              <h2>Create New User</h2>
              <UserForm
                onSubmit={handleCreateUser}
                onCancel={handleCancel}
                isLoading={loading}
              />
            </div>
          )}

          {editingUser && (
            <div className="form-container">
              <h2>Edit User</h2>
              <UserForm
                initialUser={editingUser}
                onSubmit={handleUpdateUser}
                onCancel={handleCancel}
                isLoading={loading}
              />
            </div>
          )}

          <UserList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            isLoading={loading}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;