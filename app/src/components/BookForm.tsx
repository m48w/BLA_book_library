import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import type { Author } from '../types/author';
import type { Genre } from '../types/genre';
import type { Publisher } from '../types/publisher';
import type { BookFormData } from '../services/api';
import { fetchBookByIsbn } from '../services/api';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: bold;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const SaveButton = styled(Button)`
  background-color: #28a745;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
`;

const IsbnFetchButton = styled(Button)`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

interface BookFormProps {
  authors: Author[];
  genres: Genre[];
  publishers: Publisher[];
  onSave: (book: BookFormData) => void;
  onCancel: () => void;
  initialBookData?: BookFormData; // Added for editing
}

const BookForm: React.FC<BookFormProps> = ({ authors, genres, publishers, onSave, onCancel, initialBookData }) => {
  console.log("BookForm: initialBookData received", initialBookData);
  const [formData, setFormData] = useState<BookFormData>(initialBookData || {
    title: '',
    authorIds: [],
    publisherId: undefined,
    genreId: undefined,
    publicationDate: '',
    isbn: '',
    coverImageUrl: '',
    description: '',
    notes: '',
    isRecommended: false,
    statusId: 1, // Default status for new books
  });

  // Update form data when initialBookData changes (for editing)
  useEffect(() => {
    if (initialBookData) {
      console.log("BookForm: useEffect - initialBookData changed", initialBookData);
      setFormData(initialBookData);
    }
  }, [initialBookData]);

  const authorOptions = authors.map(a => ({ value: a.id, label: a.name }));
  console.log("BookForm: authorOptions", authorOptions);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => {
      const newState = {
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      };
      console.log("BookForm: handleChange - new formData", newState);
      return newState;
    });
  };

  const handleAuthorChange = (selectedOptions: any) => {
    setFormData(prev => {
      const newAuthorIds = selectedOptions ? selectedOptions.map((o: any) => o.value) : [];
      const newState = {
        ...prev,
        authorIds: newAuthorIds,
      };
      console.log("BookForm: handleAuthorChange - new formData", newState);
      return newState;
    });
  };

  const handleFetchByIsbn = async () => {
    if (!formData.isbn) {
      alert('ISBNを入力してください。');
      return;
    }
    try {
      const data = await fetchBookByIsbn(formData.isbn);
      if (data.items && data.items.length > 0) {
        const volumeInfo = data.items[0].volumeInfo;
        setFormData(prev => ({
          ...prev,
          title: volumeInfo.title || '',
          description: volumeInfo.description || '',
          coverImageUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || '',
          publicationDate: volumeInfo.publishedDate || '',
          publisherId: publishers.find(p => p.name === volumeInfo.publisher)?.id || undefined,
          genreId: genres.find(g => g.name === volumeInfo.categories?.[0])?.id || undefined,
          authorIds: volumeInfo.authors ? volumeInfo.authors.map((authorName: string) => {
            const existingAuthor = authors.find(a => a.name === authorName);
            return existingAuthor ? existingAuthor.id : 0; // Use 0 for unknown authors, handle on backend or alert user
          }).filter((id: number) => id !== 0) : [],
        }));
      } else {
        alert('指定されたISBNの書籍情報が見つかりませんでした。');
      }
    } catch (error) {
      console.error('ISBNからの情報取得に失敗しました:', error);
      alert('ISBNからの情報取得中にエラーが発生しました。');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.authorIds.length === 0) {
      alert('タイトルと著者は必須です。');
      return;
    }
    onSave(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>タイトル: <Input type="text" name="title" value={formData.title} onChange={handleChange} required /></Label>
      <Label>ISBN: 
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input type="text" name="isbn" value={formData.isbn} onChange={handleChange} />
          <IsbnFetchButton type="button" onClick={handleFetchByIsbn}>ISBNから取得</IsbnFetchButton>
        </div>
      </Label>
      <Label>著者: 
        <Select
          isMulti
          options={authorOptions}
          value={authorOptions.filter(option => formData.authorIds.includes(option.value))}
          onChange={handleAuthorChange}
          placeholder="著者を選択..."
        />
      </Label>
      <Label>出版社: 
        <select name="publisherId" value={formData.publisherId} onChange={handleChange}>
          <option value="">選択してください</option>
          {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </Label>
      <Label>ジャンル: 
        <select name="genreId" value={formData.genreId} onChange={handleChange}>
          <option value="">選択してください</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </Label>
      <Label>出版日: <Input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} /></Label>
      <Label>表紙画像URL: <Input type="text" name="coverImageUrl" value={formData.coverImageUrl} onChange={handleChange} /></Label>
      <Label>概要: <TextArea name="description" value={formData.description} onChange={handleChange} /></Label>
      <Label>備考: <TextArea name="notes" value={formData.notes} onChange={handleChange} /></Label>
      <CheckboxLabel>
        <input type="checkbox" name="isRecommended" checked={formData.isRecommended} onChange={handleChange} />
        おすすめ
      </CheckboxLabel>
      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>キャンセル</CancelButton>
        <SaveButton type="submit">保存</SaveButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default BookForm;



