import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { Book } from '../types/book';
import { useAuth } from '../context/AuthContext';
import type { Feedback } from '../types/feedback';
import { getFeedbacks, addFeedback } from '../services/api';

const DetailContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  flex-direction: column;
`;

const TopSection = styled.div`
  display: flex;
  gap: 2rem;
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

const CommentSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const CommentItem = styled.li`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const CommentBody = styled.p`
  margin: 0;
  font-size: 0.95rem;
  white-space: pre-wrap;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  font-family: inherit;
`;

const SubmitButton = styled(ActionButton)`
  align-self: flex-end;
`;


interface BookDetailsProps {
  book: Book;
  onBorrow: (bookId: number) => void;
  onEdit: (book: Book) => void;
  onReturn: (bookId: number) => void; // Added
}

const BookDetails: React.FC<BookDetailsProps> = ({ book, onBorrow, onEdit, onReturn }) => {
  const { isAdmin, currentUser } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    if (!book.id) return;
    try {
      const data = await getFeedbacks(book.id);
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  }, [book.id]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      return;
    }
    try {
      const newFeedback = await addFeedback(book.id, {
        comment: newComment,
        userId: currentUser.id,
      });
      setFeedbacks([newFeedback, ...feedbacks]);
      setNewComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
      alert('コメントの投稿に失敗しました。');
    }
  };

  return (
    <DetailContainer>
      <TopSection>
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
          </ButtonGroup>
        </InfoSection>
      </TopSection>

      <CommentSection>
        <h3>コメント</h3>
        {currentUser && (
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentTextarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを追加..."
              rows={3}
            />
            <SubmitButton type="submit">投稿</SubmitButton>
          </CommentForm>
        )}
        <CommentList>
          {feedbacks.length > 0 ? (
            feedbacks.map(fb => (
              <CommentItem key={fb.id}>
                <CommentHeader>
                  <strong>{fb.userName}</strong>
                  <span>{new Date(fb.createdAt).toLocaleString()}</span>
                </CommentHeader>
                <CommentBody>{fb.comment}</CommentBody>
              </CommentItem>
            ))
          ) : (
            <p>まだコメントはありません。</p>
          )}
        </CommentList>
      </CommentSection>
    </DetailContainer>
  );
};

export default BookDetails;
