import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getDashboardStats } from '../services/api';
import type { DashboardStats } from '../types/dashboard';
import type { Book } from '../types/book';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
  margin: 0;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0 0 0;
`;

const RecentBooksList = styled.ul`
  list-style: none;
  padding: 0;
`;

const BookItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const BookImage = styled.img`
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
`;

const PlaceholderImage = styled.div`
  width: 50px;
  height: 70px;
  background-color: #e0e0e0;
`;

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError('ダッシュボードデータの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!stats) return <p>データがありません。</p>;

  return (
    <Container>
      <Title>ダッシュボード</Title>
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalBooks}</StatValue>
          <StatLabel>総書籍数</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.rentedBooks}</StatValue>
          <StatLabel>貸出中の書籍</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>総ユーザー数</StatLabel>
        </StatCard>
      </StatsGrid>

      <h2>最近追加された書籍</h2>
      <RecentBooksList>
        {stats.recentlyAddedBooks.map((book: Book) => (
          <BookItem key={book.id}>
            {book.coverImageUrl ? (
              <BookImage src={book.coverImageUrl} alt={book.title} />
            ) : (
              <PlaceholderImage />
            )}
            <div>
              <strong>{book.title}</strong>
              <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#555' }}>
                {book.authorNames || '不明な著者'}
              </p>
            </div>
          </BookItem>
        ))}
      </RecentBooksList>
    </Container>
  );
};

export default DashboardPage;
