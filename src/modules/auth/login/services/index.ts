import apiService from "../../../../services/ApiService";
import type { AxiosInstance } from "axios";

type LoginApiResponse = {
  access_token: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginTokenReturn = {
  token: string;
};

class LoginService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly loginRoute: string = "auth/login"
  ) {}

  async login(payload: LoginPayload): Promise<LoginTokenReturn> {
    const {
      data: { access_token },
    } = await this.apiService.post<LoginApiResponse>(this.loginRoute, payload);
    return { token: access_token };
  }
}

const loginService = new LoginService(apiService.axios);

export default loginService;
