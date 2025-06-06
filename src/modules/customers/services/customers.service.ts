import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type { Customers } from "./customers.types";

class CustomersService {
  constructor(private readonly apiService: AxiosInstance) {}

  async getData(): Promise<Customers> {
    const apiRoute = "/customers";
    const { data } = await this.apiService.get(apiRoute);
    return data;
  }
}

const customersService = new CustomersService(apiService.axios);

export default customersService;
