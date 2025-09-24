import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getActiveRentals, returnBook, forceBorrowBook, getBooks, getUsers, extendRental } from '../services/api';
import type { RentalDisplay } from '../types/rentalDisplay';
import type { Book } from '../types/book';
import type { User } from '../types/user';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const RentalListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const RentalCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-align: center;
`;

const BookImage = styled.img`
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.8rem;
`;

const PlaceholderImage = styled.div`
  width: 150px;
  height: 200px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1rem;
  border-radius: 4px;
  margin-bottom: 0.8rem;
`;

const BookTitle = styled.h3`
  margin: 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
`;

const UserInfo = styled.p`
  margin: 0.2rem 0;
  color: #555;
  font-size: 0.9rem;
`;

const DueDate = styled.p`
  margin: 0.5rem 0;
  color: #d9534f;
  font-weight: bold;
  font-size: 0.95rem;
`;

const ReturnButton = styled.button`
  background-color: #5cb85c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background-color: #4cae4c;
  }
`;

const ForceBorrowContainer = styled.div`
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 3rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  div {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  select, button {
    padding: 0.8rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    background-color: #f0ad4e;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #ec971f;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ExtendButton = styled.button`
  background-color: #f0ad4e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ec971f;
  }
`;

const RentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<RentalDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveRentals();
      setRentals(data);
    } catch (err) {
      setError('貸出中の書籍データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBooksAndUsers = useCallback(async () => {
    try {
      const booksData = await getBooks();
      const usersData = await getUsers();
      setBooks(booksData);
      setUsers(usersData);
      if (booksData.length > 0) setSelectedBookId(String(booksData[0].id));
      if (usersData.length > 0) setSelectedUserId(String(usersData[0].id));
    } catch (err) {
      setError('書籍またはユーザーのデータの取得に失敗しました。');
    }
  }, []);

  useEffect(() => {
    fetchRentals();
    fetchBooksAndUsers();
  }, [fetchRentals, fetchBooksAndUsers]);

  const handleReturn = async (bookId: number) => {
    try {
      await returnBook(bookId);
      alert('書籍が返却されました。');
      fetchRentals(); // Refresh the list
    } catch (err) {
      alert('返却処理に失敗しました。');
    }
  };

  const handleExtend = async (bookId: number) => {
    try {
      await extendRental(bookId);
      alert('貸出期間を延長しました。');
      fetchRentals();
    } catch (err) {
      alert('延長処理に失敗しました。');
    }
  };

  const handleForceBorrow = async () => {
    if (!selectedBookId || !selectedUserId) {
      alert('書籍とユーザーを選択してください。');
      return;
    }
    try {
      await forceBorrowBook(Number(selectedBookId), Number(selectedUserId));
      alert('書籍を強制的に貸し出しました。');
      fetchRentals(); // Refresh the list
    } catch (err) {
      alert('強制貸出処理に失敗しました。');
    }
  };

  return (
    <Container>
      <Title>貸出管理</Title>

      <ForceBorrowContainer>
        <h2>強制貸出</h2>
        <div>
          <select value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)}>
            {books.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}
          </select>
          <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <button onClick={handleForceBorrow}>強制貸出を実行</button>
        </div>
      </ForceBorrowContainer>

      <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>貸出中の書籍</h2>
      {loading && <p>読み込み中...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && rentals.length === 0 && <p style={{ textAlign: 'center' }}>現在、貸出中の書籍はありません。</p>}
      {!loading && !error && rentals.length > 0 && (
        <RentalListContainer>
          {rentals.map(rental => (
            <RentalCard key={rental.rentalId}>
              {rental.bookCoverImageUrl ? (
                <BookImage src={rental.bookCoverImageUrl} alt={rental.bookTitle} />
              ) : (
                <PlaceholderImage>No Image</PlaceholderImage>
              )}
              <BookTitle>{rental.bookTitle}</BookTitle>
              <UserInfo>借りている人: {rental.userName}</UserInfo>
              <DueDate>返却予定日: {new Date(rental.dueDate).toLocaleDateString()}</DueDate>
              <ButtonContainer>
                <ReturnButton onClick={() => handleReturn(rental.bookId)}>返却</ReturnButton>
                <ExtendButton onClick={() => handleExtend(rental.bookId)}>延長</ExtendButton>
              </ButtonContainer>
            </RentalCard>
          ))}
        </RentalListContainer>
      )}
    </Container>
  );
};

export default RentalsPage;