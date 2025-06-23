import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";

export type Appointment = {
  customer: {
    id: number;
    name: string;
  };
  id: number;
  date: string;
  time: string;
};

export type CreateAppointmentPayload = {
  customerId: number;
  date: string;
  time: string;
};

class AppointmentsService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/appointments"
  ) {}

  async getMonthData(date: string): Promise<Appointment[]> {
    const route = `${this.apiRoute}/month/${date}`;
    const { data } = await this.apiService.get(route);
    return data;
  }

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const { data } = await this.apiService.post(this.apiRoute, payload);
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.apiService.delete(`${this.apiRoute}/${id}`);
  }
}

const appointmentsService = new AppointmentsService(apiService.axios);

export default appointmentsService;
