export interface UpdateOrderPayload {
  id: number;
  order: number;
}

export interface ChronologicalCycle {
  id: number;
  date: string; // "AAAA-MM-DD"
  cycle: string | null;
  fase: string | null;
  emotionalScale: string | null;
  physicalScale: string | null;
  order: number;
}

export interface CreateChronologicalCyclePayload {
  customerId: number;
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

// Ciclos agrupados por data ("AAAA-MM-DD"), da mais recente para a mais antiga.
export type ChronologicalCycleList = Record<string, ChronologicalCycle[]>;
