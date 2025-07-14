import React from 'react';
import { User } from '../types';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="empty-state">No users found</div>;
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Message:</strong> {user.message}</p>
          </div>
          <div className="user-actions">
            <button onClick={() => onEdit(user)} className="edit-btn">
              Edit
            </button>
            <button 
              onClick={() => user.id && onDelete(user.id)} 
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;