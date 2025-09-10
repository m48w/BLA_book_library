import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../services/api';
import GenreList from '../components/GenreList';
import GenreForm from '../components/GenreForm';
import Modal from '../components/Modal';
import type { Genre } from '../types/genre';

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

// const HeaderContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

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

const GenresPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const fetchGenres = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGenres(keyword);
      setGenres(data);
    } catch (err) {
      console.error("Error fetching genres:", err);
      setError('ジャンルデータの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleSearch = () => {
    fetchGenres(searchTerm);
  };

  const handleSaveGenre = async (genreName: string) => {
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, genreName);
      } else {
        await createGenre(genreName);
      }
      closeModal();
      fetchGenres(searchTerm);
    } catch (err) {
      console.error("Error saving genre:", err);
      setError('ジャンルの保存に失敗しました。');
    }
  };

  const handleDeleteGenre = async (id: number) => {
    if (window.confirm('本当にこのジャンルを削除しますか？')) {
      try {
        await deleteGenre(id);
        fetchGenres(searchTerm);
      } catch (err) {
        console.error("Error deleting genre:", err);
        setError('ジャンルの削除に失敗しました。');
      }
    }
  };

  const openModal = (genre: Genre | null = null) => {
    setEditingGenre(genre);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGenre(null);
  };

  return (
    <Container>
      <Title>ジャンル一覧</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="ジャンル名で検索..."
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
        <GenreList 
          genres={genres} 
          onDelete={handleDeleteGenre} 
          onEdit={openModal}
        />
      }

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{editingGenre ? 'ジャンル編集' : '新規ジャンル追加'}</h2>
        <GenreForm 
          onSave={handleSaveGenre} 
          onCancel={closeModal} 
          initialGenreName={editingGenre?.name}
        />
      </Modal>
    </Container>
  );
};

export default GenresPage;
