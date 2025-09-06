import React from 'react';
import styled from 'styled-components';
import type { Genre } from '../types/genre';

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

interface GenreListProps {
  genres: Genre[];
  onEdit: (genre: Genre) => void;
  onDelete: (id: number) => void;
}

const GenreList: React.FC<GenreListProps> = ({ genres, onEdit, onDelete }) => {
  return (
    <List>
      {genres.map(genre => (
        <ListItem key={genre.id}>
          {genre.name}
          <ButtonGroup>
            <EditButton onClick={() => onEdit(genre)}>編集</EditButton>
            <DeleteButton onClick={() => onDelete(genre.id)}>削除</DeleteButton>
          </ButtonGroup>
        </ListItem>
      ))}
    </List>
  );
};

export default GenreList;
