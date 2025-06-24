import { ref, reactive, toRefs, watch, computed } from "vue";
import chronologicalCycleService from "../services/chronological-cycle.service";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import type {
  ChronologicalCycle,
  ChronologicalCycleFormData,
  ChronologicalCycleList,
} from "../services/chronological-cycle.types";
import { formatDateToAPI } from "@/helpers/date.helper";

const chronologicalCycleState = reactive({
  isLoading: false,
  isSaving: false,
  list: [] as ChronologicalCycle[],
});

const chronologicalCycleListState = reactive({
  isLoading: false,
  viewList: {} as ChronologicalCycleList,
});

const actualListIds = computed(() =>
  chronologicalCycleState.list.map(({ id }) => id)
);

const hasOrderChanged = computed(() => {
  return (
    savedOrder.value.length === actualListIds.value.length &&
    savedOrder.value.every((id, index) => id === actualListIds.value[index])
  );
});

const savedOrder = ref<number[]>([]);
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
        formatDateToAPI(selectedDate.value)
      );
      chronologicalCycleState.list = data;
      savedOrder.value = data.map((cycle) => cycle.id);
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
        date: formatDateToAPI(selectedDate.value),
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

      savedOrder.value = [...savedOrder.value, data.id];

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

  const updateCycle = async (cycle: ChronologicalCycle) => {
    chronologicalCycleState.isSaving = true;
    try {
      const customerId = Number(route.params.id);
      const data = await chronologicalCycleService.updateChronologicalCycle(
        customerId,
        cycle
      );
      const index = chronologicalCycleState.list.findIndex(
        (item) => item.id === cycle.id
      );
      if (index !== -1) {
        chronologicalCycleState.list[index] = data;
      }

      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Ciclo atualizado com sucesso",
        life: 3000,
      });
    } catch {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao atualizar ciclo",
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
      savedOrder.value = cycles.map((cycle) => cycle.id);
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

  const deleteCycle = async (id: number) => {
    chronologicalCycleState.isSaving = true;
    try {
      await chronologicalCycleService.deleteChronologicalCycle(id);
      chronologicalCycleState.list = chronologicalCycleState.list.filter(
        (cycle) => cycle.id !== id
      );
      savedOrder.value = savedOrder.value.filter((order) => order !== id);
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Ciclo deletado com sucesso",
        life: 3000,
      });
    } catch {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao deletar ciclo",
        life: 3000,
      });
    } finally {
      chronologicalCycleState.isSaving = false;
    }
  };

  const getList = async () => {
    try {
      chronologicalCycleListState.isLoading = true;
      const customerId = Number(route.params.id);
      const data = await chronologicalCycleService.getChronologicalCycleList(
        customerId
      );
      chronologicalCycleListState.viewList = data;
    } catch (error) {
      console.error("Error fetching customers data:", error);
    } finally {
      chronologicalCycleListState.isLoading = false;
    }
  };

  watch(selectedDate, () => {
    getData();
  });
  return {
    ...toRefs(chronologicalCycleState),
    ...toRefs(chronologicalCycleFormState),
    ...toRefs(chronologicalCycleListState),
    selectedCycle,
    getData,
    createCycle,
    saveOrder,
    selectedDate,
    hasOrderChanged,
    deleteCycle,
    updateCycle,
    getList,
  };
};
