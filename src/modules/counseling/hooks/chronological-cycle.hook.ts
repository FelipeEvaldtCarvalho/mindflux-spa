import { ref, reactive, toRefs } from "vue";
import chronologicalCycleService from "../services/chronological-cycle.service";
import { useRoute } from "vue-router";
import type {
  ChronologicalCycle,
  ChronologicalCycleFormData,
} from "../services/chronological-cycle.types";

const chronologicalCycleState = reactive({
  isLoading: false,
  isSaving: false,
  chronologicalCycles: [] as ChronologicalCycle[],
});

const selectedCycle = ref<ChronologicalCycle | undefined>();
const selectedDate = ref(new Date());

const chronologicalCycleFormState = reactive<ChronologicalCycleFormData>({
  cycle: "",
  fase: "",
  emotionalScale: "",
  physicalScale: "",
});

export const useChronologicalCycle = () => {
  const route = useRoute();
  const getData = async () => {
    try {
      const customerId = route.params.id as string;
      const data = await chronologicalCycleService.getChronologicalCycleByDate(
        customerId,
        selectedDate.value.toISOString().split("T")[0]
      );
      console.log(data);
    } catch (error) {
      console.error("Error fetching customers data:", error);
    } finally {
    }
  };

  const createCycle = async () => {
    try {
      const customerId = route.params.id as string;
      const payload = {
        date: selectedDate.value.toISOString().split("T")[0],
        cycle: chronologicalCycleFormState.cycle,
        fase: chronologicalCycleFormState.fase,
        emotionalScale: chronologicalCycleFormState.emotionalScale,
        physicalScale: chronologicalCycleFormState.physicalScale,
      };
      const data = await chronologicalCycleService.createChronologicalCycle(
        customerId,
        payload
      );
      console.log(data);
    } catch (error) {
      console.error("Error creating cycle:", error);
    } finally {
    }
  };

  return {
    ...toRefs(chronologicalCycleState),
    ...toRefs(chronologicalCycleFormState),
    selectedCycle,
    getData,
    createCycle,
    selectedDate,
  };
};
