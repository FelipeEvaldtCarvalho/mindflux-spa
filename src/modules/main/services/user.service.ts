import apiService from "@/services/api.service";
import { getToken } from "@/services/session.service";
import type { AxiosInstance } from "axios";
import type { User, CachedUser } from "../services/user.types";

class UserService {
  private cache: CachedUser | null = null;

  constructor(private readonly apiService: AxiosInstance) {}

  // Cache por token: trocar de conta (outro token) sempre busca de novo.
  async me(): Promise<User> {
    const token = getToken();

    if (this.cache && this.cache.token === token) {
      return this.cache.data;
    }

    const { data } = await this.apiService.get<User>("auth/verify-token");

    if (token) {
      this.cache = { token, data };
    }

    return data;
  }
}

const userService = new UserService(apiService.axios);

export default userService;
