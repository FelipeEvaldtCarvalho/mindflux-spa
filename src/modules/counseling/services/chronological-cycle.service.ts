import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type {
  ChronologicalCycle,
  CreateChronologicalCyclePayload,
} from "./chronological-cycle.types";

class ChronologicalCycleService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/chronological-cycle/"
  ) {}

  async getChronologicalCycleByDate(
    customerId: number,
    date: string
  ): Promise<ChronologicalCycle[]> {
    const { data } = await this.apiService.get<ChronologicalCycle[]>(
      `${this.apiRoute}customer/${customerId}/date/${date}`
    );
    return data;
  }

  async createChronologicalCycle(
    payload: CreateChronologicalCyclePayload
  ): Promise<ChronologicalCycle> {
    const { data } = await this.apiService.post<ChronologicalCycle>(
      `${this.apiRoute}`,
      payload
    );
    return data;
  }
}

const chronologicalCycleService = new ChronologicalCycleService(
  apiService.axios
);

export default chronologicalCycleService;
