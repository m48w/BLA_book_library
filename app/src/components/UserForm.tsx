import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { User } from '../types/user';
import type { Department } from '../types/department';
import { getDepartments } from '../services/api';

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

const Select = styled.select`
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
    departmentId: null, // Default department
    notes: '',
    isAdminStaff: false
  });
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
        if (!initialUser && data.length > 0) {
          setUser(prev => ({ ...prev, departmentId: prev.departmentId ?? null }));
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
    fetchDepartments();
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setUser(prev => ({
      ...prev,
      [name]: (() => {
        if (name === 'isAdminStaff') return value === 'true';
        if (name === 'departmentId') return value === '' ? null : Number(value);
        return value;
      })()
    }));
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
        部署:
        <Select
          name="departmentId"
          value={user.departmentId ?? ''}
          onChange={handleChange}
        >
          <option value="">（未選択）</option>
          {departments.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </Select>
      </Label>
      <Label>
        備考:
        <TextArea
          name="notes"
          value={user.notes}
          onChange={handleChange}
        />
      </Label>
      <Label>
        権限:
        <Select
          name="isAdminStaff"
          value={String(user.isAdminStaff)}
          onChange={handleChange}
        >
          <option value="false">User</option>
          <option value="true">Admin</option>
        </Select>
      </Label>
      <ButtonGroup>
        <CancelButton type="button" onClick={onCancel}>キャンセル</CancelButton>
        <Button type="submit">保存</Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default UserForm;
