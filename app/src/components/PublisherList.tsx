import React from 'react';
import styled from 'styled-components';
import type { Publisher } from '../types/publisher';

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
  padding: 0.75rem;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
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

interface PublisherListProps {
  publishers: Publisher[];
  onEdit: (publisher: Publisher) => void;
  onDelete: (id: number) => void;
}

import { useAuth } from '../context/AuthContext';

const PublisherList: React.FC<PublisherListProps> = ({ publishers, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  return (
    <List>
      {publishers.map(publisher => (
        <ListItem key={publisher.id}>
          {publisher.name}
          {isAdmin && <ButtonGroup>
            <EditButton onClick={() => onEdit(publisher)}>編集</EditButton>
            <DeleteButton onClick={() => onDelete(publisher.id)}>削除</DeleteButton>
          </ButtonGroup>}
        </ListItem>
      ))}
    </List>
  );
};

export default PublisherList;
