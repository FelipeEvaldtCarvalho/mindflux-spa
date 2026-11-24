export type CounselingFields = {
  dailyLife: string;
  expectations: string;
  hasHadTherapy: string;
  reason: string;
  symptomsTime: string;
};

export type CounselingData = CounselingFields & {
  id: number;
  customer: {
    id: number;
    name: string;
  };
};
