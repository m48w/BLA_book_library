import React from 'react';
import styled from 'styled-components';
import type { Book } from '../types/book';

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const BookCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const BookInfo = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative; /* For absolute positioning of status label */
`;

const BookTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const BookAuthors = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem 0;
  flex-grow: 1;
`;

const BookPublisher = styled.p`
    font-size: 0.8rem;
    color: #888;
    margin: 0;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 250px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1rem;
`;

const StatusLabel = styled.span<{ status: string }>`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: ${props => (props.status === '貸出可能' ? '#28a745' : '#ffc107')};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

interface BookListProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onBookClick }) => {
  return (
    <BookGrid>
      {books.map(book => (
        <BookCard key={book.id} onClick={() => onBookClick(book)}>
          {book.coverImageUrl ? (
            <BookImage src={book.coverImageUrl} alt={book.title} />
          ) : (
            <PlaceholderImage>No Image</PlaceholderImage>
          )}
          <BookInfo>
            {book.statusName && <StatusLabel status={book.statusName}>{book.statusName}</StatusLabel>}
            <BookTitle>{book.title}</BookTitle>
            <BookAuthors>{book.authorNames || '不明な著者'}</BookAuthors>
            <BookPublisher>{book.publisherName || '不明な出版社'}</BookPublisher>
          </BookInfo>
        </BookCard>
      ))}
    </BookGrid>
  );
};

export default BookList;
