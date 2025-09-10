import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUsers } from '../services/api';
import type { User } from '../types/user';
import { useAuth } from '../context/AuthContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const AvatarPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const UserSelectionPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('ユーザーの取得に失敗しました。');
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (user: User) => {
    login(user);
    navigate('/dashboard');
  };

  if (error) {
    return <PageContainer><Title>エラー</Title><p>{error}</p></PageContainer>;
  }

  return (
    <PageContainer>
      <Title>ユーザーを選択してください</Title>
      <UserGrid>
        {users.map(user => (
          <UserCard key={user.id} onClick={() => handleUserSelect(user)}>
            <AvatarPlaceholder>{user.name.charAt(0)}</AvatarPlaceholder>
            <UserName>{user.name}</UserName>
          </UserCard>
        ))}
      </UserGrid>
    </PageContainer>
  );
};

export default UserSelectionPage;
