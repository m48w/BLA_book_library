import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getAuthors, createAuthor, deleteAuthor, updateAuthor } from '../services/api';
import AuthorList from '../components/AuthorList';
import AuthorForm from '../components/AuthorForm';
import Modal from '../components/Modal';
import type { Author } from '../types/author';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddButton = styled(SearchButton)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

import { useAuth } from '../context/AuthContext';

const AuthorsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const fetchAuthors = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuthors(keyword);
      setAuthors(data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setError('著者データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleSearch = () => {
    fetchAuthors(searchTerm);
  };

  const handleSaveAuthor = async (authorName: string) => {
    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, authorName);
      } else {
        await createAuthor(authorName);
      }
      closeModal();
      fetchAuthors(searchTerm);
    } catch (err) {
      console.error("Error saving author:", err);
      setError('著者の保存に失敗しました。');
    }
  };

  const handleDeleteAuthor = async (authorId: number) => {
    if (window.confirm('本当にこの著者を削除しますか？')) {
      try {
        await deleteAuthor(authorId);
        fetchAuthors(searchTerm);
      } catch (err) {
        console.error("Error deleting author:", err);
        setError('著者の削除に失敗しました。');
      }
    }
  };

  const openModal = (author: Author | null = null) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
  };

  return (
    <Container>
      <Title>著者一覧</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="著者名で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButton onClick={handleSearch}>検索</SearchButton>
        {isAdmin && <AddButton onClick={() => openModal()}>新規追加</AddButton>}
      </SearchContainer>
      {loading && <p>読み込み中...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && 
        <AuthorList 
          authors={authors} 
          onDelete={handleDeleteAuthor} 
          onEdit={(author) => openModal(author)}
        />
      }

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{editingAuthor ? '著者編集' : '新規著者追加'}</h2>
        <AuthorForm 
          onSave={handleSaveAuthor} 
          onCancel={closeModal} 
          initialAuthorName={editingAuthor?.name}
        />
      </Modal>
    </Container>
  );
};

export default AuthorsPage;