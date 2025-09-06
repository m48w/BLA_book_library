import React from 'react';
import styled from 'styled-components';
import type { User } from '../types/user';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f4f4;
  margin-bottom: 0.5rem;
  padding: 1rem;
  border-radius: 5px;
`;

const UserInfo = styled.div`
  flex-grow: 1;
`;

const UserDetail = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const Button = styled.button`
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
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
  return (
    <List>
      {users.map(user => (
        <ListItem key={user.id}>
          <UserInfo>
            <div><strong>{user.name}</strong> ({user.nameKana})</div>
            <UserDetail>メール: {user.email}</UserDetail>
            <UserDetail>部署: {user.departmentName} ({user.code})</UserDetail>
            {user.notes && <UserDetail>備考: {user.notes}</UserDetail>}
          </UserInfo>
          <ButtonGroup>
            <EditButton onClick={() => onEdit(user)}>編集</EditButton>
            <DeleteButton onClick={() => onDelete(user.id)}>削除</DeleteButton>
          </ButtonGroup>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
