import { reactive, toRefs, watch } from "vue";
import chronologicalCycleService from "../services/chronological-cycle.service";
import { useToast } from "primevue/usetoast";
import type {
  ChronologicalCycle,
  ChronologicalCycleFormData,
  ChronologicalCycleList,
} from "../services/chronological-cycle.types";
import { formatDateToAPI } from "@/helpers/date.helper";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

// Estado único da tela de ciclos. O cliente é definido por setCustomer() na página
// (antes cada componente registrava seus próprios watchers e a lista era buscada 3x).
const state = reactive({
  customerId: 0,
  selectedDate: new Date(),
  isLoading: false,
  isSaving: false,
  isSavingOrder: false,
  list: [] as ChronologicalCycle[],
  historyLoading: false,
  history: {} as ChronologicalCycleList,
});

const form = reactive<ChronologicalCycleFormData>({
  cycle: "",
  fase: "",
  emotionalScale: "",
  physicalScale: "",
});

const resetForm = () => Object.assign(form, { cycle: "", fase: "", emotionalScale: "", physicalScale: "" });

let toast: ReturnType<typeof useToast> | null = null;
const notifyError = (summary: string, error: unknown) =>
  toast?.add({
    severity: "error",
    summary,
    detail: getApiErrorMessage(error, "Tente novamente."),
    life: 5000,
  });

let listRequest = 0;
const loadDay = async () => {
  if (!state.customerId) return;
  const requestId = ++listRequest;
  state.isLoading = true;
  try {
    const data = await chronologicalCycleService.getChronologicalCycleByDate(
      state.customerId,
      formatDateToAPI(state.selectedDate)
    );
    if (requestId === listRequest) state.list = data;
  } catch (error) {
    if (requestId === listRequest) {
      state.list = [];
      notifyError("Erro ao carregar os ciclos", error);
    }
  } finally {
    if (requestId === listRequest) state.isLoading = false;
  }
};

const loadHistory = async () => {
  if (!state.customerId) return;
  state.historyLoading = true;
  try {
    state.history = await chronologicalCycleService.getChronologicalCycleList(state.customerId);
  } catch (error) {
    notifyError("Erro ao carregar o histórico", error);
  } finally {
    state.historyLoading = false;
  }
};

watch(
  () => state.selectedDate,
  () => loadDay()
);

// Salva a nova ordem logo após mover (com uma pequena espera para agrupar
// vários toques seguidos). Antes era preciso lembrar de tocar em "salvar".
let orderTimer: ReturnType<typeof setTimeout> | undefined;
const saveOrderSoon = () => {
  clearTimeout(orderTimer);
  orderTimer = setTimeout(async () => {
    state.isSavingOrder = true;
    try {
      await chronologicalCycleService.updateOrder(
        state.list.map((cycle, index) => ({ id: cycle.id, order: index + 1 }))
      );
    } catch (error) {
      notifyError("A nova ordem não foi salva", error);
      await loadDay();
    } finally {
      state.isSavingOrder = false;
    }
  }, 700);
};

export const useChronologicalCycle = () => {
  toast = useToast();

  const setCustomer = (customerId: number) => {
    clearTimeout(orderTimer);
    state.customerId = customerId;
    state.list = [];
    state.history = {};
    resetForm();
    const today = new Date();
    if (formatDateToAPI(state.selectedDate) !== formatDateToAPI(today)) {
      state.selectedDate = today; // o watcher recarrega
    } else {
      loadDay();
    }
  };

  const createCycle = async () => {
    if (!form.fase.trim() || !form.cycle.trim()) return false;
    state.isSaving = true;
    try {
      const data = await chronologicalCycleService.createChronologicalCycle({
        customerId: state.customerId,
        date: formatDateToAPI(state.selectedDate),
        cycle: form.cycle.trim(),
        fase: form.fase.trim(),
        emotionalScale: form.emotionalScale.trim(),
        physicalScale: form.physicalScale.trim(),
      });
      state.list.push(data);
      resetForm();
      return true;
    } catch (error) {
      notifyError("Não foi possível adicionar o ciclo", error);
      return false;
    } finally {
      state.isSaving = false;
    }
  };

  const updateCycle = async (cycle: ChronologicalCycle) => {
    state.isSaving = true;
    try {
      const data = await chronologicalCycleService.updateChronologicalCycle(cycle.id, {
        cycle: cycle.cycle,
        fase: cycle.fase,
        emotionalScale: cycle.emotionalScale,
        physicalScale: cycle.physicalScale,
      });
      const index = state.list.findIndex((item) => item.id === cycle.id);
      if (index !== -1) state.list[index] = data;
      toast?.add({ severity: "success", summary: "Ciclo atualizado", life: 2500 });
    } catch (error) {
      notifyError("Não foi possível atualizar o ciclo", error);
    } finally {
      state.isSaving = false;
    }
  };

  const reorder = (items: ChronologicalCycle[]) => {
    state.list = items;
    saveOrderSoon();
  };

  const deleteCycle = async (id: number) => {
    state.isSaving = true;
    try {
      await chronologicalCycleService.deleteChronologicalCycle(id);
      state.list = state.list.filter((cycle) => cycle.id !== id);
      toast?.add({ severity: "success", summary: "Ciclo excluído", life: 2500 });
    } catch (error) {
      notifyError("Não foi possível excluir o ciclo", error);
    } finally {
      state.isSaving = false;
    }
  };

  return {
    ...toRefs(state),
    ...toRefs(form),
    setCustomer,
    loadDay,
    loadHistory,
    createCycle,
    updateCycle,
    reorder,
    deleteCycle,
  };
};
