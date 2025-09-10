import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getPublishers, createPublisher, updatePublisher, deletePublisher } from '../services/api';
import PublisherList from '../components/PublisherList';
import PublisherForm from '../components/PublisherForm';
import Modal from '../components/Modal';
import type { Publisher } from '../types/publisher';

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

const PublishersPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  const fetchPublishers = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublishers(keyword);
      setPublishers(data);
    } catch (err) {
      console.error("Error fetching publishers:", err);
      setError('出版社データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublishers();
  }, [fetchPublishers]);

  const handleSearch = () => {
    fetchPublishers(searchTerm);
  };

  const handleSavePublisher = async (publisherName: string) => {
    try {
      if (editingPublisher) {
        await updatePublisher(editingPublisher.id, publisherName);
      } else {
        await createPublisher(publisherName);
      }
      closeModal();
      fetchPublishers(searchTerm);
    } catch (err) {
      console.error("Error saving publisher:", err);
      setError('出版社の保存に失敗しました。');
    }
  };

  const handleDeletePublisher = async (id: number) => {
    if (window.confirm('本当にこの出版社を削除しますか？')) {
      try {
        await deletePublisher(id);
        fetchPublishers(searchTerm);
      } catch (err) {
        console.error("Error deleting publisher:", err);
        setError('出版社の削除に失敗しました。');
      }
    }
  };

  const openModal = (publisher: Publisher | null = null) => {
    setEditingPublisher(publisher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPublisher(null);
  };

  return (
    <Container>
      <Title>出版社一覧</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="出版社名で検索..."
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
        <PublisherList 
          publishers={publishers} 
          onDelete={handleDeletePublisher} 
          onEdit={openModal}
        />
      }

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{editingPublisher ? '出版社編集' : '新規出版社追加'}</h2>
        <PublisherForm 
          onSave={handleSavePublisher} 
          onCancel={closeModal} 
          initialPublisherName={editingPublisher?.name}
        />
      </Modal>
    </Container>
  );
};

export default PublishersPage;
