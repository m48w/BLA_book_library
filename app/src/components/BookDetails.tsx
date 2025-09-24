import React from 'react';
import styled from 'styled-components';
import type { Book } from '../types/book';
import { useAuth } from '../context/AuthContext';

const DetailContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const CoverImage = styled.img`
  width: 200px;
  height: auto;
  object-fit: contain;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PlaceholderImage = styled.div`
  width: 200px;
  height: 300px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoSection = styled.div`
  flex-grow: 1;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #333;
`;

const DetailText = styled.p`
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.95rem;
`;

const Description = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #444;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #ffc107;

  &:hover {
    background-color: #e0a800;
  }
`;

const ForceButton = styled(ActionButton)`
  background-color: #dc3545; // 赤色にして危険な操作であることを示す

  &:hover {
    background-color: #c82333;
  }
`;

interface BookDetailsProps {
  book: Book;
  onBorrow: (bookId: number) => void;
  onEdit: (book: Book) => void;
  onReturn: (bookId: number) => void; // Added
  onForceAvailable: (bookId: number) => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onBorrow, onEdit, onReturn, onForceAvailable }) => {
  const { isAdmin } = useAuth();

  const handleForceAvailable = () => {
    if (window.confirm(`この本の貸し出し記録に問題がある可能性があります。
強制的に「貸出可能」状態に戻しますか？
この操作は取り消せません。`)) {
      onForceAvailable(book.id);
    }
  };

  return (
    <DetailContainer>
      {book.coverImageUrl ? (
        <CoverImage src={book.coverImageUrl} alt={book.title} />
      ) : (
        <PlaceholderImage>No Image</PlaceholderImage>
      )}
      <InfoSection>
        <Title>{book.title}</Title>
        <DetailText><strong>著者:</strong> {book.authorNames || '不明な著者'}</DetailText>
        <DetailText><strong>出版社:</strong> {book.publisherName || '不明な出版社'}</DetailText>
        <DetailText><strong>ジャンル:</strong> {book.genreName || '不明なジャンル'}</DetailText>
        <DetailText><strong>出版日:</strong> {book.publicationDate || '不明'}</DetailText>
        <DetailText><strong>ISBN:</strong> {book.isbn || '不明'}</DetailText>
        <DetailText><strong>ステータス:</strong> {book.statusName || '不明'}</DetailText>

        {book.description && (
          <Description>
            <h3>概要</h3>
            <p>{book.description}</p>
          </Description>
        )}

        {book.notes && (
          <Description>
            <h3>備考</h3>
            <p>{book.notes}</p>
          </Description>
        )}

        <ButtonGroup>
          {book.statusName === '貸出可能' && (
            <ActionButton onClick={() => onBorrow(book.id)}>借出し</ActionButton>
          )}
          {book.statusName === '貸出中' && (
            <ActionButton onClick={() => onReturn(book.id)}>返却</ActionButton>
          )}
          {isAdmin && <EditButton onClick={() => onEdit(book)}>編集</EditButton>}
          {isAdmin && book.statusName === '貸出中' && (
            <ForceButton onClick={handleForceAvailable}>強制的に貸出可能にする</ForceButton>
          )}
        </ButtonGroup>
      </InfoSection>
    </DetailContainer>
  );
};

export default BookDetails;
