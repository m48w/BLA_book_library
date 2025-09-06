import { Routes, Route, Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthorsPage from './pages/AuthorsPage';
import GenresPage from './pages/GenresPage';
import PublishersPage from './pages/PublishersPage';
import UsersPage from './pages/UsersPage';
import BooksPage from './pages/BooksPage';
import DashboardPage from './pages/DashboardPage';

const Nav = styled.nav`
  background: #333;
  padding: 1rem;
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.1rem;

  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  return (
    <>
      <Nav>
        <NavLink to="/dashboard">ダッシュボード</NavLink>
        <NavLink to="/books">書籍</NavLink>
        <NavLink to="/authors">著者</NavLink>
        <NavLink to="/genres">ジャンル</NavLink>
        <NavLink to="/publishers">出版社</NavLink>
        <NavLink to="/users">ユーザー</NavLink>
      </Nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/publishers" element={<PublishersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
