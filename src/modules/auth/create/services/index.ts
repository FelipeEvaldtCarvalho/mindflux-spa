import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";

type CreateApiResponse = {
  access_token: string;
};

export type CreatePayload = {
  email: string;
  password: string;
  name?: string;
};

type Token = {
  token: string;
};

class CreateService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly createRoute: string = "auth/create"
  ) {}

  async create(payload: CreatePayload): Promise<Token> {
    const { data } = await this.apiService.post<CreateApiResponse>(
      this.createRoute,
      payload
    );
    return { token: data.access_token };
  }
}

const createService = new CreateService(apiService.axios);

export default createService;
