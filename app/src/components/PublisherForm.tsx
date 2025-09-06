import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #218838;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

interface PublisherFormProps {
  initialPublisherName?: string;
  onSave: (publisherName: string) => void;
  onCancel: () => void;
}

const PublisherForm: React.FC<PublisherFormProps> = ({ initialPublisherName = '', onSave, onCancel }) => {
  const [publisherName, setPublisherName] = useState(initialPublisherName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publisherName.trim()) {
      onSave(publisherName.trim());
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <label>
        出版社名:
        <Input
          type="text"
          value={publisherName}
          onChange={(e) => setPublisherName(e.target.value)}
          required
        />
      </label>
      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>キャンセル</CancelButton>
        <Button type="submit">保存</Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default PublisherForm;
