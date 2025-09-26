export interface Feedback {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  comment: string;
  rating?: number;
  createdAt: string;
}
