import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AuthorsPage from './pages/AuthorsPage';
import GenresPage from './pages/GenresPage';
import PublishersPage from './pages/PublishersPage';
import UsersPage from './pages/UsersPage';
import BooksPage from './pages/BooksPage';
import DashboardPage from './pages/DashboardPage';
import RentalsPage from './pages/RentalsPage';
import UserSelectionPage from './pages/UserSelectionPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Nav = styled.nav`
  background: #333;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #ffc107;
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

const UserProfile = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffc107;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-weight: bold;
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
`;

const LogoutMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding: 0.5rem 0;
  z-index: 10;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1.5rem;
  width: 100%;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

function App() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <AppContainer>
      {currentUser && (
        <Nav>
          <NavLinks>
            <NavLink to="/dashboard">ダッシュボード</NavLink>
            <NavLink to="/books">書籍</NavLink>
            <NavLink to="/rentals">貸出中</NavLink>
            <NavLink to="/authors">著者</NavLink>
            <NavLink to="/genres">ジャンル</NavLink>
            <NavLink to="/publishers">出版社</NavLink>
            <NavLink to="/users">ユーザー</NavLink>
          </NavLinks>
          <UserProfile onClick={() => setMenuOpen(!menuOpen)}>
            <Avatar>{currentUser.name.charAt(0)}</Avatar>
            <UserName>{currentUser.name}</UserName>
            {menuOpen && (
              <LogoutMenu>
                <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
              </LogoutMenu>
            )}
          </UserProfile>
        </Nav>
      )}
      <MainContent>
        <Routes>
          <Route path="/" element={currentUser ? <Navigate replace to="/dashboard" /> : <UserSelectionPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/rentals" element={<RentalsPage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/publishers" element={<PublishersPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;