import axios from 'axios';
import type { Author } from '../types/author';
import type { Genre } from '../types/genre';
import type { Publisher } from '../types/publisher';
import type { User } from '../types/user'; // 追加
import type { Department } from '../types/department';
import type { Book } from '../types/book';
import type { DashboardStats } from '../types/dashboard';

const apiClient = axios.create({
  baseURL: '/api/v1', // Viteのプロキシ設定に合わせる
});

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

export const getRecommendedBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get('/books/recommended');
  return response.data;
};

export const getBooks = async (keyword?: string, genreId?: number): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>('/books', { params: { keyword, genreId } });
  return response.data;
};

export interface BookFormData {
  title: string;
  publisherId?: number;
  publicationDate?: string;
  isbn?: string;
  coverImageUrl?: string;
  genreId?: number;
  description?: string;
  notes?: string;
  isRecommended: boolean;
  authorIds: number[];
  statusId: number;
}

export const createBook = async (book: BookFormData): Promise<Book> => {
  const response = await apiClient.post<Book>('/books', book);
  return response.data;
};

export const updateBook = async (id: number, book: BookFormData): Promise<void> => {
  await apiClient.put(`/books/${id}`, book);
};

export const fetchBookByIsbn = async (isbn: string): Promise<any> => {
  const response = await apiClient.get(`/isbn/${isbn}`);
  return response.data;
};

export const getAuthors = async (keyword?: string): Promise<Author[]> => { // keywordパラメータ追加
  const response = await apiClient.get<Author[]>('/authors', { params: { keyword } }); // params追加
  return response.data;
};

export const createAuthor = async (authorName: string): Promise<Author> => {
  const response = await apiClient.post<Author>('/authors', { name: authorName });
  return response.data;
};

export const deleteAuthor = async (authorId: number): Promise<void> => { // 追加
  await apiClient.delete(`/authors/${authorId}`);
};

export const updateAuthor = async (authorId: number, authorName: string): Promise<void> => { // 追加
  await apiClient.put(`/authors/${authorId}`, { name: authorName });
};

export const getGenres = async (keyword?: string): Promise<Genre[]> => {
  const response = await apiClient.get<Genre[]>('/genres', { params: { keyword } });
  return response.data;
};

export const createGenre = async (name: string): Promise<Genre> => {
  const response = await apiClient.post<Genre>('/genres', { name });
  return response.data;
};

export const updateGenre = async (id: number, name: string): Promise<void> => {
  await apiClient.put(`/genres/${id}`, { id, name });
};

export const deleteGenre = async (id: number): Promise<void> => {
  await apiClient.delete(`/genres/${id}`);
};

export const getPublishers = async (keyword?: string): Promise<Publisher[]> => {
  const response = await apiClient.get<Publisher[]>('/publishers', { params: { keyword } });
  return response.data;
};

export const createPublisher = async (name: string): Promise<Publisher> => {
  const response = await apiClient.post<Publisher>('/publishers', { name });
  return response.data;
};

export const updatePublisher = async (id: number, name: string): Promise<void> => {
  await apiClient.put(`/publishers/${id}`, { id, name });
};

export const deletePublisher = async (id: number): Promise<void> => {
  await apiClient.delete(`/publishers/${id}`);
};

export const getDepartments = async (keyword?: string): Promise<Department[]> => {
  const response = await apiClient.get<Department[]>('/departments', { params: { keyword } });
  return response.data;
};

export const getUsers = async (keyword?: string): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users', { params: { keyword } });
  return response.data;
};

export const createUser = async (user: Omit<User, 'id' | 'departmentName'>): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
};

export const updateUser = async (id: number, user: Omit<User, 'id' | 'departmentName'>): Promise<void> => {
  await apiClient.put(`/users/${id}`, user);
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};

export const borrowBook = async (bookId: number, userId: number): Promise<any> => {
  const response = await apiClient.post(`/rentals/borrow?bookId=${bookId}&userId=${userId}`);
  return response.data;
};

export const returnBook = async (bookId: number): Promise<void> => {
  await apiClient.post(`/rentals/return?bookId=${bookId}`);
};

export const extendRental = async (bookId: number): Promise<void> => {
  await apiClient.post(`/rentals/extend?bookId=${bookId}`);
};

export const forceSetAvailable = async (bookId: number): Promise<void> => {
  await apiClient.post(`/books/${bookId}/force-available`);
};

export const getActiveRentals = async (): Promise<RentalDisplay[]> => {
  const response = await apiClient.get<RentalDisplay[]>('/rentals/active');
  return response.data;
};

export const forceBorrowBook = async (bookId: number, userId: number): Promise<any> => {
  const response = await apiClient.post(`/rentals/force-borrow?bookId=${bookId}&userId=${userId}`);
  return response.data;
};
