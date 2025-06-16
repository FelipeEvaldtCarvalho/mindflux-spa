export interface Customer {
  id: number;
  name?: string;
}

export interface ChronologicalCycle {
  id: number;
  customer: Customer;
  date: Date;
  cycle: string;
  fase: string;
  emotionalScale: string;
  physicalScale: string;
  order: number;
}

export interface CreateChronologicalCyclePayload {
  date: string;
  cycle: string;
  fase: string;
  emotionalScale: string;
  physicalScale: string;
}

export interface ChronologicalCycleFormData {
  cycle: string;
  fase: string;
  emotionalScale: string;
  physicalScale: string;
}
