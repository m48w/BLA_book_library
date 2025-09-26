import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDashboardStats, getRecommendedBooks } from '../services/api';
import type { DashboardStats } from '../types/dashboard';
import type { Book } from '../types/book';
import { useAuth } from '../context/AuthContext';

// Styled Components
const PageContainer = styled.div`
  padding: 2rem;
  background-color: #f0f2f5;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.2rem;
  color: #1a202c;
  margin: 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin-top: 0.25rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const StatValue = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d3748;
  margin: 0;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #a0aec0;
  margin: 0.5rem 0 0 0;
`;

const Section = styled.section`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const BookListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const BookCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1rem;
`;

const BookInfo = styled.div`
  padding: 1rem;
`;

const BookTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookAuthor = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: red;
`;

// Main Component
const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, recommendedData] = await Promise.all([
          getDashboardStats(),
          getRecommendedBooks(),
        ]);
        setStats(statsData);
        setRecommendedBooks(recommendedData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('ダッシュボードデータの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageContainer><p>読み込み中...</p></PageContainer>;
  if (error) return <PageContainer><ErrorMessage>{error}</ErrorMessage></PageContainer>;

  return (
    <PageContainer>
      <WelcomeHeader>
        <WelcomeTitle>ようこそ、{currentUser?.name}さん！</WelcomeTitle>
        <WelcomeSubtitle>今日のライブラリの状況を確認しましょう。</WelcomeSubtitle>
      </WelcomeHeader>

      {/* Summary Area */}
      {stats && (
        <SummaryGrid>
          <StatCard><StatValue>{stats.totalBooks}</StatValue><StatLabel>総書籍数</StatLabel></StatCard>
          <StatCard><StatValue>{stats.rentedBooks}</StatValue><StatLabel>貸出中の書籍</StatLabel></StatCard>
          <StatCard><StatValue>{stats.totalUsers}</StatValue><StatLabel>総ユーザー数</StatLabel></StatCard>
        </SummaryGrid>
      )}

      {/* Recently Added Books */}
      {stats && stats.recentlyAddedBooks.length > 0 && (
        <Section>
          <SectionTitle>最近追加した本</SectionTitle>
          <BookListGrid>
            {stats.recentlyAddedBooks.map(book => (
              <BookCard key={`recent-${book.id}`}>
                {book.coverImageUrl ? (
                  <BookCover src={book.coverImageUrl} alt={book.title} />
                ) : (
                  <PlaceholderImage>No Image</PlaceholderImage>
                )}
                <BookInfo>
                  <BookTitle title={book.title}>{book.title}</BookTitle>
                  <BookAuthor>{book.authorNames || '不明'}</BookAuthor>
                </BookInfo>
              </BookCard>
            ))}
          </BookListGrid>
        </Section>
      )}

      {/* Recommended Books */}
      {recommendedBooks.length > 0 && (
        <Section>
          <SectionTitle>今月のおすすめ本</SectionTitle>
          <BookListGrid>
            {recommendedBooks.map(book => (
              <BookCard key={`rec-${book.id}`}>
                {book.coverImageUrl ? (
                  <BookCover src={book.coverImageUrl} alt={book.title} />
                ) : (
                  <PlaceholderImage>No Image</PlaceholderImage>
                )}
                <BookInfo>
                  <BookTitle title={book.title}>{book.title}</BookTitle>
                  <BookAuthor>{book.authorNames || '不明'}</BookAuthor>
                </BookInfo>
              </BookCard>
            ))}
          </BookListGrid>
        </Section>
      )}
    </PageContainer>
  );
};

export default DashboardPage;