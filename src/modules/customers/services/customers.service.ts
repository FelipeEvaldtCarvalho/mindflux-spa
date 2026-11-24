import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type { Customer, Customers, CustomerPayload } from "./customers.types";

class CustomersService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/customers"
  ) {}

  async getData(): Promise<Customers> {
    const { data } = await this.apiService.get<Customers>(this.apiRoute);
    return data;
  }

  async createCustomer(payload: CustomerPayload): Promise<Customer> {
    const { data } = await this.apiService.post<Customer>(this.apiRoute, payload);
    return data;
  }

  async updateCustomer(id: number, payload: CustomerPayload): Promise<void> {
    await this.apiService.put(`${this.apiRoute}/${id}`, payload);
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.apiService.delete(`${this.apiRoute}/${id}`);
  }
}

const customersService = new CustomersService(apiService.axios);

export default customersService;
