import type { CounselingData } from "../services/counseling.types";
import { ref, reactive, toRefs } from "vue";
import counselingService from "../services/counseling.service";
import { useRoute } from "vue-router";

const initialized = ref(false);
const loading = ref(false);

const customerCounselingState = reactive<CounselingData>({
  id: 0,
  customer: {
    id: 0,
    name: "",
  },
  dailyLife: "",
  expectations: "",
  hasHadTherapy: "",
  reason: "",
  symptomsTime: "",
});

export const useCounseling = () => {
  const route = useRoute();
  const customerId = route.params.id as string;

  const getData = async () => {
    loading.value = true;
    try {
      const data = await counselingService.getCustomerCounseling(customerId);
      Object.assign(customerCounselingState, data);
    } catch (error) {
      console.error("Error fetching customers data:", error);
    } finally {
      loading.value = false;
    }
  };

  const updateData = async () => {
    loading.value = true;
    try {
      const payload = {
        dailyLife: customerCounselingState.dailyLife,
        expectations: customerCounselingState.expectations,
        hasHadTherapy: customerCounselingState.hasHadTherapy,
        reason: customerCounselingState.reason,
        symptomsTime: customerCounselingState.symptomsTime,
      };
      await counselingService.updateCustomerCounseling(customerId, payload);
    } catch (error) {
      console.error("Error updating customers data:", error);
    } finally {
      loading.value = false;
    }
  };

  if (!initialized.value) {
    getData();
    initialized.value = true;
  }

  return {
    ...toRefs(customerCounselingState),
    loading,
    updateData,
  };
};
