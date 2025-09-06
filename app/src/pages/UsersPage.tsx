import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import Modal from '../components/Modal';
import type { User } from '../types/user';

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

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async (keyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(keyword);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError('ユーザーデータの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = () => {
    fetchUsers(searchTerm);
  };

  const handleSaveUser = async (user: Omit<User, 'id' | 'departmentName'>) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, user);
      } else {
        await createUser(user);
      }
      closeModal();
      fetchUsers(searchTerm);
    } catch (err) {
      console.error("Error saving user:", err);
      setError('ユーザーの保存に失敗しました。');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('本当にこのユーザーを削除しますか？')) {
      try {
        await deleteUser(id);
        fetchUsers(searchTerm);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError('ユーザーの削除に失敗しました。');
      }
    }
  };

  const openModal = (user: User | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <Container>
      <Title>ユーザー一覧</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="名前、カナ、メール等で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButton onClick={handleSearch}>検索</SearchButton>
        <AddButton onClick={() => openModal()}>新規追加</AddButton>
      </SearchContainer>
      {loading && <p>読み込み中...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && 
        <UserList 
          users={users} 
          onDelete={handleDeleteUser} 
          onEdit={openModal}
        />
      }

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>{editingUser ? 'ユーザー編集' : '新規ユーザー追加'}</h2>
        <UserForm 
          onSave={handleSaveUser} 
          onCancel={closeModal} 
          initialUser={editingUser ? { ...editingUser } : undefined}
        />
      </Modal>
    </Container>
  );
};

export default UsersPage;
