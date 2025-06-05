import router from "../router";

class LogoutService {
  logout(): void {
    localStorage.removeItem("user_token");
    router.push("/auth/login");
  }
}

const logoutServiceInstance = new LogoutService();

export default logoutServiceInstance;
