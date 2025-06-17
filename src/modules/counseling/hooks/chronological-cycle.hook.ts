import { ref, reactive, toRefs, watch } from "vue";
import chronologicalCycleService from "../services/chronological-cycle.service";
import { useRoute } from "vue-router";
import type {
  ChronologicalCycle,
  ChronologicalCycleFormData,
} from "../services/chronological-cycle.types";

const chronologicalCycleState = reactive({
  isLoading: false,
  isSaving: false,
  list: [] as ChronologicalCycle[],
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
    chronologicalCycleState.isLoading = true;
    try {
      const customerId = Number(route.params.id);
      const data = await chronologicalCycleService.getChronologicalCycleByDate(
        customerId,
        selectedDate.value.toISOString().split("T")[0]
      );
      chronologicalCycleState.list = data;
    } catch (error) {
      console.error("Error fetching customers data:", error);
    } finally {
      chronologicalCycleState.isLoading = false;
    }
  };

  const createCycle = async () => {
    chronologicalCycleState.isSaving = true;
    try {
      const customerId = Number(route.params.id);
      const payload = {
        customerId,
        date: selectedDate.value.toISOString().split("T")[0],
        cycle: chronologicalCycleFormState.cycle,
        fase: chronologicalCycleFormState.fase,
        emotionalScale: chronologicalCycleFormState.emotionalScale,
        physicalScale: chronologicalCycleFormState.physicalScale,
      };
      const data = await chronologicalCycleService.createChronologicalCycle(
        payload
      );
      console.log(data);
    } catch (error) {
      console.error("Error creating cycle:", error);
    } finally {
      chronologicalCycleState.isSaving = false;
    }
  };

  watch(selectedDate, () => {
    getData();
  });

  return {
    ...toRefs(chronologicalCycleState),
    ...toRefs(chronologicalCycleFormState),
    selectedCycle,
    getData,
    createCycle,
    selectedDate,
  };
};
