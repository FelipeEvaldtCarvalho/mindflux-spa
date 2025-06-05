import logoutService from "@/services/logout.service";

const logout = async () => {
  try {
    logoutService.logout();
  } catch (error) {
  } finally {
  }
};

export const useMain = () => {
  return {
    logout,
  };
};
