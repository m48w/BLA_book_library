import React, { useState } from 'react';
import styled from 'styled-components';
import type { User } from '../types/user';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  min-height: 80px;
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

const Label = styled.label`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-weight: bold;
`;


interface UserFormProps {
  initialUser?: Omit<User, 'id' | 'departmentName'>;
  onSave: (user: Omit<User, 'id' | 'departmentName'>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSave, onCancel }) => {
  const [user, setUser] = useState(initialUser || {
    name: '',
    nameKana: '',
    email: '',
    code: '',
    departmentId: 1, // Default department
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (user.name.trim() && user.email.trim()) {
      onSave(user);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>
        氏名:
        <Input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />
      </Label>
      <Label>
        氏名（カナ）:
        <Input
          type="text"
          name="nameKana"
          value={user.nameKana}
          onChange={handleChange}
          required
        />
      </Label>
      <Label>
        メールアドレス:
        <Input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </Label>
      <Label>
        社員番号:
        <Input
          type="text"
          name="code"
          value={user.code}
          onChange={handleChange}
        />
      </Label>
      <Label>
        部署ID:
        <Input
          type="number"
          name="departmentId"
          value={user.departmentId}
          onChange={handleChange}
          required
        />
      </Label>
      <Label>
        備考:
        <TextArea
          name="notes"
          value={user.notes}
          onChange={handleChange}
        />
      </Label>
      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>キャンセル</CancelButton>
        <Button type="submit">保存</Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default UserForm;
