export type Customer = {
  id: number;
  name: string;
  document?: string | null;
  birthdate?: string | null; // "AAAA-MM-DD"
  address?: string | null;
  phone: string; // só dígitos
};

export type Customers = Customer[];

export type CustomerPayload = {
  name: string;
  phone: string;
  document: string | null;
  birthdate: string | null;
  address: string | null;
};
