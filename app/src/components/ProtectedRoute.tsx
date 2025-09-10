import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // ローディング中は何も表示しないか、スピナーを表示
    return <div>Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
