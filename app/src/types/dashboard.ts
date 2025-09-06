import type { Book } from './book';

export interface DashboardStats {
  totalBooks: number;
  rentedBooks: number;
  totalUsers: number;
  recentlyAddedBooks: Book[];
}
