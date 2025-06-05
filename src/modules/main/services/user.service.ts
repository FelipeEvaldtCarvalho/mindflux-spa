import apiService from "@/services/ApiService";
import type { AxiosInstance } from "axios";
import type { User, CachedUser } from "../services/user.types";

class UserService {
  constructor(
    private readonly apiService: AxiosInstance,
    private cache: CachedUser | null = null
  ) {}

  async me(): Promise<User> {
    const token = localStorage.getItem("user_token");

    if (this.cache && this.cache.token === token) {
      return this.cache.data;
    }

    const apiRoute = "auth/verify-token";
    const { data } = await this.apiService.get<User>(apiRoute);

    if (token) {
      this.cache = { token, data };
    }

    return data;
  }
}

const userService = new UserService(apiService.axios);

export default userService;
