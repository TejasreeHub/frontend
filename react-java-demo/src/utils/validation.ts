import { User } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: { [key: string]: string } = {};

  // Name validation
  if (!user.name || user.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (user.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (user.name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  } else if (!/^[a-zA-Z\s]+$/.test(user.name.trim())) {
    errors.name = 'Name can only contain letters and spaces';
  }

  // Email validation
  if (!user.email || user.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Message validation
  if (!user.message || user.message.trim().length === 0) {
    errors.message = 'Message is required';
  } else if (user.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  } else if (user.message.trim().length > 500) {
    errors.message = 'Message cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};