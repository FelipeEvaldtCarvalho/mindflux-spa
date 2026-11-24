export type UserRole = "admin" | "operator";

export type User = {
  email: string;
  id: number;
  name: string | null;
  role: UserRole;
};

export type CachedUser = {
  token: string;
  data: User;
};
