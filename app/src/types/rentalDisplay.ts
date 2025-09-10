export interface RentalDisplay {
  rentalId: number;
  bookId: number;
  bookTitle: string;
  bookCoverImageUrl?: string;
  userId: number;
  userName: string;
  rentalDate: string;
  dueDate: string;
}
