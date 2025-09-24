import React from 'react';
import styled from 'styled-components';
import type { User } from '../types/user';
import { useAuth } from '../context/AuthContext';

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const UserCard = styled.div`
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

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007bff;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const UserRole = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
`;

const UserEmail = styled.p`
  font-size: 0.8rem;
  color: #777;
  margin: 0 0 1rem 0;
  word-break: break-all;
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

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  return (
    <UserGrid>
      {users.map(user => (
        <UserCard key={user.id}>
          <Avatar>
            {user.photo_url ? (
              <img src={user.photo_url} alt={user.name} />
            ) : (
              user.name.charAt(0)
            )}
          </Avatar>
          <UserName>{user.name}</UserName>
          <UserRole>{user.isAdminStaff ? 'Admin' : 'User'}</UserRole>
          <UserEmail>{user.email}</UserEmail>
          {isAdmin && (
            <ButtonGroup>
              <EditButton onClick={() => onEdit(user)}>編集</EditButton>
              <DeleteButton onClick={() => onDelete(user.id)}>削除</DeleteButton>
            </ButtonGroup>
          )}
        </UserCard>
      ))}
    </UserGrid>
  );
};

export default UserList;