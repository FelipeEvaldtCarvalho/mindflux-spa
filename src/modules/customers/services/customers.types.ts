export type Customer = {
  id: string;
  name: string;
  document?: string;
  birthdate?: string;
  address?: string;
  phone: string;
};

export type Customers = Customer[];

export type CreateCustomer = Omit<Customer, "id">;
