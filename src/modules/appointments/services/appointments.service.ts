import apiService from "@/services/api.service";
import type { AxiosInstance } from "axios";

export type Appointment = {
  customer: {
    id: number;
    name: string;
  };
  id: number;
  date: string; // "AAAA-MM-DD"
  time: string; // "HH:mm"
};

export type CreateAppointmentPayload = {
  customerId: number;
  date: string;
  time: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

class AppointmentsService {
  constructor(
    private readonly apiService: AxiosInstance,
    private readonly apiRoute: string = "/appointments"
  ) {}

  // month: 1–12
  async getMonthData(year: number, month: number): Promise<Appointment[]> {
    const { data } = await this.apiService.get<Appointment[]>(
      `${this.apiRoute}/month/${pad(month)}-${year}`
    );
    return data;
  }

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const { data } = await this.apiService.post<Appointment>(this.apiRoute, payload);
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.apiService.delete(`${this.apiRoute}/${id}`);
  }
}

const appointmentsService = new AppointmentsService(apiService.axios);

export default appointmentsService;
