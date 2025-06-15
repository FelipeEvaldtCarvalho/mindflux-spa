export type CounselingData = {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  dailyLife: string;
  expectations: string;
  hasHadTherapy: string;
  reason: string;
  symptomsTime: string;
};
