import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type { DashboardInfo } from "../services/dashboard.types";

class DashboardService {
  constructor(private readonly apiService: AxiosInstance) {}

  async getData(): Promise<DashboardInfo> {
    const apiRoute = "dashboard";
    const { data } = await this.apiService.get<DashboardInfo>(apiRoute);
    return data;
  }
}

const dashboardService = new DashboardService(apiService.axios);

export default dashboardService;
