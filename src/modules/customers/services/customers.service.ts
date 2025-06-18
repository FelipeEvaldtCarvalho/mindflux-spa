import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type { Customers, CreateCustomer } from "./customers.types";

class CustomersService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/customers"
  ) {}

  async getData(): Promise<Customers> {
    const { data } = await this.apiService.get(this.apiRoute);
    return data;
  }

  async createCustomer(payload: CreateCustomer): Promise<any> {
    return await this.apiService.post(this.apiRoute, payload);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.apiService.delete(`${this.apiRoute}/${id}`);
  }
}

const customersService = new CustomersService(apiService.axios);

export default customersService;
