import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type {
  ChronologicalCycle,
  CreateChronologicalCyclePayload,
} from "./chronological-cycle.types";

class ChronologicalCycleService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/chronological-cycle/customer/"
  ) {}

  async getChronologicalCycleByDate(
    customerId: string,
    date: string
  ): Promise<ChronologicalCycle[]> {
    const { data } = await this.apiService.get<ChronologicalCycle[]>(
      `${this.apiRoute}${customerId}/date/${date}`
    );
    return data;
  }

  async createChronologicalCycle(
    customerId: string,
    payload: CreateChronologicalCyclePayload
  ): Promise<ChronologicalCycle> {
    const { data } = await this.apiService.post<ChronologicalCycle>(
      `${this.apiRoute}${customerId}`,
      payload
    );
    return data;
  }
}

const chronologicalCycleService = new ChronologicalCycleService(
  apiService.axios
);

export default chronologicalCycleService;
