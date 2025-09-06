export interface Book {
  id: number;
  title: string;
  publisherName?: string;
  publicationDate?: string; // Dates are often strings in JSON
  isbn?: string;
  coverImageUrl?: string;
  genreName?: string;
  description?: string;
  notes?: string;
  isRecommended: boolean;
  authorNames?: string;
  statusName?: string;
  statusId?: number;
}
