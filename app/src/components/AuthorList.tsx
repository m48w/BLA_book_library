import React from 'react';
import styled from 'styled-components';
import type { Author } from '../types/author';

const AuthorListContainer = styled.ul`
  list-style: none;
  padding: 0;
`;

const AuthorItem = styled.li`
  background: #f4f4f4;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthorName = styled.span`
  flex-grow: 1;
`;

const ActionButton = styled.button`
  padding: 0.3rem 0.6rem;
  margin-left: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const EditButton = styled(ActionButton)` /* 追加 */
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

interface AuthorListProps {
  authors: Author[];
  onDelete: (authorId: number) => void;
  onEdit: (author: Author) => void; // 追加
}

const AuthorList: React.FC<AuthorListProps> = ({ authors, onDelete, onEdit }) => { // onEditを追加
  return (
    <AuthorListContainer>
      {authors.map(author => (
        <AuthorItem key={author.id}>
          <AuthorName>{author.name}</AuthorName>
          <div> {/* ボタンをまとめるdivを追加 */}
            <EditButton onClick={() => onEdit(author)}>編集</EditButton> {/* 編集ボタン */}
            <DeleteButton onClick={() => onDelete(author.id)}>削除</DeleteButton>
          </div>
        </AuthorItem>
      ))}
    </AuthorListContainer>
  );
};

export default AuthorList;
