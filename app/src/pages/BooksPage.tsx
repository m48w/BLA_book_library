import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getBooks, createBook, getAuthors, getGenres, getPublishers, updateBook, borrowBook, returnBook } from '../services/api';
import type { BookFormData } from '../services/api';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';
import BookDetails from '../components/BookDetails';
import Modal from '../components/Modal';
import type { Book } from '../types/book';
import type { Author } from '../types/author';
import type { Genre } from '../types/genre';
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
  margin-bottom: 2rem;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-grow: 1;
  gap: 0.5rem;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const SearchButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddButton = styled(SearchButton)`
  background-color: #28a745;
  margin-left: 1rem;

  &:hover {
    background-color: #218838;
  }
`;

import { useAuth } from '../context/AuthContext';

const BooksPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBookFormData, setEditingBookFormData] = useState<BookFormData | undefined>(undefined);

  // Data for form dropdowns
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const fetchBooks = useCallback(async (keyword?: string, genreId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBooks(keyword, genreId);
      console.log("Fetched books:", data);
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError('書籍データの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFormData = useCallback(async () => {
    try {
      setAuthors(await getAuthors());
      const fetchedGenres = await getGenres();
      setGenres(fetchedGenres);
      setPublishers(await getPublishers());
    } catch (error) {
      console.error("Error fetching form data:", error);
      setError('フォームデータの取得に失敗しました。');
    }
  }, []);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  useEffect(() => {
    fetchBooks(searchTerm, selectedGenre);
  }, [fetchBooks, searchTerm, selectedGenre]);

  const handleSearch = () => {
    fetchBooks(searchTerm, selectedGenre);
  };

  const bookToFormData = (book: Book, allAuthors: Author[], allGenres: Genre[], allPublishers: Publisher[]): BookFormData => {
    const authorIds = book.authorNames
      ? book.authorNames.split(', ').map(name => {
          const author = allAuthors.find(a => a.name === name.trim());
          return author ? author.id : 0; // Use 0 for not found, then filter out
        }).filter(id => id !== 0)
      : [];

    return {
      title: book.title,
      publisherId: book.publisherName ? allPublishers.find(p => p.name === book.publisherName)?.id : undefined,
      publicationDate: book.publicationDate,
      isbn: book.isbn,
      coverImageUrl: book.coverImageUrl,
      genreId: book.genreName ? allGenres.find(g => g.name === book.genreName)?.id : undefined,
      description: book.description,
      notes: book.notes,
      isRecommended: book.isRecommended,
      authorIds: authorIds,
      statusId: book.statusId || 1,
    };
  };

  const handleSaveBook = async (bookData: BookFormData) => {
    try {
      if (selectedBook && isEditModalOpen) { // Editing existing book
        await updateBook(selectedBook.id, bookData);
      } else { // Creating new book
        await createBook(bookData);
      }
      closeAllModals();
      fetchBooks(searchTerm, selectedGenre); // Re-fetch with current filters
    } catch (err) {
      console.error("Error saving book:", err);
      setError('書籍の保存に失敗しました。');
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  };

  const handleBorrow = async (bookId: number) => {
    const userId = 1; // TODO: Replace with actual user ID from authentication
    try {
      console.log("Before borrow - selectedBook:", selectedBook);
      await borrowBook(bookId, userId);
      alert(`書籍ID: ${bookId} を借りました。`);
      closeAllModals();
      await fetchBooks(searchTerm, selectedGenre); // Ensure fetchBooks completes
      // Find the updated book from the newly fetched list and set it as selectedBook
      const updatedBook = books.find(book => book.id === bookId);
      if (updatedBook) {
        setSelectedBook(updatedBook);
      }
      console.log("After borrow - selectedBook:", selectedBook);
    } catch (err) {
      console.error("Error borrowing book:", err);
      alert('書籍の貸出しに失敗しました。');
    }
  };

  const handleReturn = async (bookId: number) => {
    try {
      console.log("Before return - selectedBook:", selectedBook);
      await returnBook(bookId);
      alert(`書籍ID: ${bookId} を返却しました。`);
      closeAllModals();
      await fetchBooks(searchTerm, selectedGenre); // Ensure fetchBooks completes
      // Find the updated book from the newly fetched list and set it as selectedBook
      const updatedBook = books.find(book => book.id === bookId);
      if (updatedBook) {
        setSelectedBook(updatedBook);
      }
      console.log("After return - selectedBook:", selectedBook);
    } catch (err) {
      console.error("Error returning book:", err);
      alert('書籍の返却に失敗しました。');
    }
  };

  const handleEdit = (book: Book) => {
    console.log("handleEdit: called with book", book);
    setSelectedBook(book);
    setIsDetailsModalOpen(false); // Close details modal
    // Transform book to BookFormData before passing to BookForm
    const formData = bookToFormData(book, authors, genres, publishers); // Pass all necessary data for lookup
    console.log("handleEdit: transformed formData", formData);
    setEditingBookFormData(formData); // New state to hold transformed data
    setIsEditModalOpen(true); // Open edit modal
    console.log("handleEdit: isEditModalOpen set to true");
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedBook(null);
    setEditingBookFormData(undefined);
    console.log("closeAllModals: all modals closed");
  };

  return (
    <Container>
      <Title>書籍一覧</Title>
      <HeaderContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="タイトル、著者名、ISBNで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Select
            value={selectedGenre ?? ''}
            onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">すべてのジャンル</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </Select>
          <SearchButton onClick={handleSearch}>検索</SearchButton>
        </SearchContainer>
        {isAdmin && <AddButton onClick={() => setIsAddModalOpen(true)}>新規追加</AddButton>}
      </HeaderContainer>
      {loading && <p>読み込み中...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && <BookList books={books} onBookClick={handleBookClick} />}

      {/* Add Book Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAllModals}>
        <h2>新規書籍追加</h2>
        <BookForm
          authors={authors}
          genres={genres}
          publishers={publishers}
          onSave={handleSaveBook}
          onCancel={closeAllModals}
        />
      </Modal>

      {/* Book Details Modal */}
      {selectedBook && (
        <Modal isOpen={isDetailsModalOpen} onClose={closeAllModals}>
          <BookDetails
            book={selectedBook}
            onBorrow={handleBorrow}
            onEdit={handleEdit}
            onReturn={handleReturn}
          />
        </Modal>
      )}

      {/* Edit Book Modal */}
      {selectedBook && (
        <Modal isOpen={isEditModalOpen} onClose={closeAllModals}>
          <h2>書籍編集</h2>
          <BookForm
            authors={authors}
            genres={genres}
            publishers={publishers}
            onSave={handleSaveBook}
            onCancel={closeAllModals}
            initialBookData={editingBookFormData}
          />
        </Modal>
      )}
    </Container>
  );
};

export default BooksPage;