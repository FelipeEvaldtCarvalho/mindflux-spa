export type User = {
  email: string;
  id: number;
  name: string | null;
};

export type CachedUser = {
  token: string;
  data: User;
};
