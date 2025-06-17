import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";
import type {
  ChronologicalCycle,
  CreateChronologicalCyclePayload,
  UpdateOrderPayload,
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

  async updateChronologicalCycle(
    id: number,
    payload: Partial<ChronologicalCycle>
  ): Promise<ChronologicalCycle> {
    const { data } = await this.apiService.patch<ChronologicalCycle>(
      `${this.apiRoute}${id}`,
      payload
    );
    return data;
  }

  async deleteChronologicalCycle(id: number): Promise<void> {
    await this.apiService.delete(`${this.apiRoute}${id}`);
  }

  async updateOrder(cycles: UpdateOrderPayload[]): Promise<void> {
    await this.apiService.post("/chronological-cycle/order", cycles);
  }
}

const chronologicalCycleService = new ChronologicalCycleService(
  apiService.axios
);

export default chronologicalCycleService;
