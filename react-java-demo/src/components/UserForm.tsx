import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { validateUser } from '../utils/validation';

interface UserFormProps {
  initialUser?: User;
  onSubmit: (user: User) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSubmit, onCancel, isLoading }) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const validation = validateUser(user);
    if (validation.errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validation.errors[name] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateUser(user);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({ name: true, email: true, message: true });
      return;
    }
    
    onSubmit(user);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.name && touched.name ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.name && touched.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email && touched.email ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.email && touched.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          value={user.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={errors.message && touched.message ? 'error' : ''}
          disabled={isLoading}
        />
        {errors.message && touched.message && <span className="error-message">{errors.message}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialUser ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;