// Contact Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

// Task types
export interface Task {
  id: string;
  contactId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

// on save types
export interface onSaveTypes<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  deletedId?: string;
}
