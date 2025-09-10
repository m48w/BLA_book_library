import React from 'react';
import styled from 'styled-components';
import type { Author } from '../types/author';
import { useAuth } from '../context/AuthContext';

const AuthorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const AuthorCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  text-align: center;
  position: relative;
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
  background-color: #6c757d;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
`;

const AuthorName = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-size: 0.9rem;
`;

const EditButton = styled(Button)`
  background-color: #ffc107;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
`;

interface AuthorListProps {
  authors: Author[];
  onEdit: (author: Author) => void;
  onDelete: (id: number) => void;
}

// AuthorList component displays a grid of authors.
const AuthorList: React.FC<AuthorListProps> = ({ authors, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  return (
    <AuthorGrid>
      {authors.map(author => (
        <AuthorCard key={author.id}>
          <AvatarPlaceholder>{author.name.charAt(0)}</AvatarPlaceholder>
          <AuthorName>{author.name}</AuthorName>
          {isAdmin && (
            <ButtonGroup>
              <EditButton onClick={() => onEdit(author)}>編集</EditButton>
              <DeleteButton onClick={() => onDelete(author.id)}>削除</DeleteButton>
            </ButtonGroup>
          )}
        </AuthorCard>
      ))}
    </AuthorGrid>
  );
};

export default AuthorList;