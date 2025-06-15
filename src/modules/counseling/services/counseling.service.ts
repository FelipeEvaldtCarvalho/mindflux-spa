import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type { CounselingData } from "./counseling.types";

class CounselingService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/counseling/customer/"
  ) {}

  async getCustomerCounseling(customerId: string): Promise<CounselingData> {
    const { data } = await this.apiService.get<CounselingData>(
      `${this.apiRoute}${customerId}`
    );
    return data;
  }

  async updateCustomerCounseling(
    customerId: string,
    payload: Partial<CounselingData>
  ): Promise<CounselingData> {
    const { data } = await this.apiService.patch<CounselingData>(
      `${this.apiRoute}${customerId}`,
      payload
    );
    return data;
  }
}

const counselingService = new CounselingService(apiService.axios);

export default counselingService;
