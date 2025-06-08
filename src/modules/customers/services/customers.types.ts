type Customer = {
  id: number;
  name: string;
  document: string | null;
  birthdate: string | null;
  address: string | null;
  phone: string | null;
};

export type Customers = Customer[];

export type CreateCustomer = Partial<Customer>;
