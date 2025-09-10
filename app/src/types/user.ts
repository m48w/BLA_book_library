export interface User {
  id: number;
  name: string;
  email: string;
  code: string;
  nameKana: string;
  notes: string;
  departmentId: number | null;
  departmentName: string | null;
  isAdminStaff: boolean;
}
