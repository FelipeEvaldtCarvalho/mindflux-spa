import router from "../router";
import { clearSession } from "./session.service";

class LogoutService {
  logout(): void {
    clearSession();
    router.push({ name: "auth.login" });
  }
}

const logoutServiceInstance = new LogoutService();

export default logoutServiceInstance;
