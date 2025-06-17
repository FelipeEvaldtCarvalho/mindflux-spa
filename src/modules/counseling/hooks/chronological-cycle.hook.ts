import { ref, reactive, toRefs, watch } from "vue";
import chronologicalCycleService from "../services/chronological-cycle.service";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
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
  const toast = useToast();

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
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao carregar os ciclos cronológicos",
        life: 3000,
      });
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

      chronologicalCycleState.list.push(data);

      chronologicalCycleFormState.cycle = "";
      chronologicalCycleFormState.fase = "";
      chronologicalCycleFormState.emotionalScale = "";
      chronologicalCycleFormState.physicalScale = "";

      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Ciclo cronológico criado com sucesso",
        life: 3000,
      });
    } catch {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao criar ciclo cronológico",
        life: 3000,
      });
    } finally {
      chronologicalCycleState.isSaving = false;
    }
  };

  const saveOrder = async () => {
    chronologicalCycleState.isSaving = true;
    try {
      const cycles: { id: number; order: number }[] =
        chronologicalCycleState.list.map((cycle, index) => {
          return {
            id: cycle.id,
            order: index + 1,
          };
        });
      await chronologicalCycleService.updateOrder(cycles);

      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Ordem dos ciclos salva com sucesso",
        life: 3000,
      });
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar a ordem dos ciclos",
        life: 3000,
      });
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
    saveOrder,
    selectedDate,
  };
};
