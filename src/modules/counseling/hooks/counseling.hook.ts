import type { CounselingFields } from "../services/counseling.types";
import { computed, reactive, ref, toRefs } from "vue";
import counselingService from "../services/counseling.service";
import { useToast } from "primevue/usetoast";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

const FIELDS: (keyof CounselingFields)[] = [
  "reason",
  "symptomsTime",
  "dailyLife",
  "hasHadTherapy",
  "expectations",
];

const emptyFields = (): CounselingFields => ({
  reason: "",
  symptomsTime: "",
  dailyLife: "",
  hasHadTherapy: "",
  expectations: "",
});

const state = reactive({
  customerId: 0,
  customerName: "",
  loading: false,
  saving: false,
  notFound: false,
});
const fields = reactive<CounselingFields>(emptyFields());
const saved = ref<CounselingFields>(emptyFields());

// Há texto digitado que ainda não foi salvo?
const isDirty = computed(() => FIELDS.some((f) => (fields[f] ?? "") !== (saved.value[f] ?? "")));

const applyFields = (data: Partial<CounselingFields>) => {
  const clean = emptyFields();
  FIELDS.forEach((f) => (clean[f] = data[f] ?? ""));
  Object.assign(fields, clean);
  saved.value = { ...clean };
};

export const useCounseling = () => {
  const toast = useToast();

  // Carrega a ficha do cliente. Limpa a anterior antes, para nunca mostrar
  // a ficha de um cliente na tela de outro se a requisição falhar.
  const load = async (customerId: number) => {
    state.customerId = customerId;
    state.customerName = "";
    state.notFound = false;
    applyFields({});
    state.loading = true;
    try {
      const data = await counselingService.getCustomerCounseling(customerId);
      state.customerName = data.customer?.name ?? "";
      applyFields(data);
    } catch {
      state.notFound = true;
    } finally {
      state.loading = false;
    }
  };

  const save = async () => {
    if (!state.customerId) return;
    state.saving = true;
    try {
      const payload = Object.fromEntries(FIELDS.map((f) => [f, fields[f]]));
      const data = await counselingService.updateCustomerCounseling(state.customerId, payload);
      applyFields(data);
      toast.add({ severity: "success", summary: "Entrevista salva", life: 2500 });
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Não foi possível salvar",
        detail: getApiErrorMessage(error, "Seu texto continua na tela. Tente novamente."),
        life: 6000,
      });
    } finally {
      state.saving = false;
    }
  };

  return {
    ...toRefs(state),
    ...toRefs(fields),
    isDirty,
    load,
    save,
  };
};
