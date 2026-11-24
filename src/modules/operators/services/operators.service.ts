import apiService from "@/services/api.service";
import type { UserRole } from "@/modules/main/services/user.types";

export type Operator = {
  id: number;
  name: string | null;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
};

export type OperatorPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
};

const api = apiService.axios;

export default {
  async list(): Promise<Operator[]> {
    const { data } = await api.get<Operator[]>("/users");
    return data;
  },
  async create(payload: OperatorPayload): Promise<Operator> {
    const { data } = await api.post<Operator>("/users", payload);
    return data;
  },
  async update(id: number, payload: OperatorPayload): Promise<Operator> {
    const { data } = await api.patch<Operator>(`/users/${id}`, payload);
    return data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
