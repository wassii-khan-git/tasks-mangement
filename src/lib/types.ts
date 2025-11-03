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

// Payload return types
export interface PayloadReturn<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";

export interface ContactsFilter {
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface OptimisticTask extends Task {
  optimistic?: boolean;
  error?: boolean;
}

export interface PaginationUrlProps {
  searchParams: Promise<{ page?: string; limit?: string }>;
}
