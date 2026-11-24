<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Skeleton from "primevue/skeleton";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import FeedBack from "@/components/FeedBack.vue";
import OperatorDialog from "./components/OperatorDialog.vue";
import operatorsService, {
  type Operator,
  type OperatorPayload,
} from "./services/operators.service";
import { useUser } from "@/modules/main/hooks/user.hook";
import { getApiErrorMessage } from "@/helpers/api-error.helper";

const toast = useToast();
const confirm = useConfirm();
const { user } = useUser();

const operators = ref<Operator[]>([]);
const isLoading = ref(true);
const hasError = ref(false);
const isSaving = ref(false);
const dialogVisible = ref(false);
const editing = ref<Operator | null>(null);

const load = async () => {
  isLoading.value = true;
  hasError.value = false;
  try {
    operators.value = await operatorsService.list();
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const openNew = () => {
  editing.value = null;
  dialogVisible.value = true;
};

const openEdit = (operator: Operator) => {
  editing.value = operator;
  dialogVisible.value = true;
};

const save = async (payload: OperatorPayload) => {
  isSaving.value = true;
  try {
    if (editing.value) {
      await operatorsService.update(editing.value.id, payload);
      toast.add({ severity: "success", summary: "Operador atualizado", life: 3000 });
    } else {
      await operatorsService.create(payload);
      toast.add({
        severity: "success",
        summary: "Operador cadastrado",
        detail: `${payload.email} já pode entrar com a senha definida.`,
        life: 5000,
      });
    }
    dialogVisible.value = false;
    await load();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Não foi possível salvar",
      detail: getApiErrorMessage(error, "Tente novamente."),
      life: 5000,
    });
  } finally {
    isSaving.value = false;
  }
};

const confirmRemove = (operator: Operator) => {
  confirm.require({
    header: "Excluir operador",
    message: `Excluir ${operator.name || operator.email}? Todos os clientes, fichas e agendamentos dele também serão apagados. Para só bloquear o acesso, use "Editar" e desative.`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancelar", severity: "secondary", outlined: true },
    acceptProps: { label: "Excluir", severity: "danger" },
    accept: async () => {
      try {
        await operatorsService.remove(operator.id);
        toast.add({ severity: "success", summary: "Operador excluído", life: 3000 });
        await load();
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Não foi possível excluir",
          detail: getApiErrorMessage(error, "Tente novamente."),
          life: 5000,
        });
      }
    },
  });
};

onMounted(load);
</script>

<template>
  <section class="grid gap-6 p-6 lg:p-8 max-w-5xl">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="page-title">Operadores</h1>
        <p class="text-surface-600">Quem pode entrar no sistema.</p>
      </div>
      <Button label="Novo operador" icon="pi pi-plus" @click="openNew" />
    </header>

    <div v-if="isLoading" class="grid gap-3">
      <Skeleton v-for="n in 3" :key="n" height="76px" borderRadius="12px" />
    </div>

    <FeedBack
      v-else-if="hasError"
      icon="warning"
      title="Erro ao carregar operadores"
      :action="load"
      actionText="Tentar novamente"
      actionIcon="pi pi-refresh"
    />

    <ul v-else class="grid gap-3">
      <li
        v-for="operator in operators"
        :key="operator.id"
        class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-surface-200 bg-surface-0"
        :class="{ 'opacity-60': !operator.isActive }"
      >
        <div class="flex-1 min-w-[12rem]">
          <p class="font-semibold text-lg">
            {{ operator.name || "Sem nome" }}
            <span v-if="operator.id === user?.id" class="text-surface-500 font-normal">
              (você)
            </span>
          </p>
          <p class="text-surface-600 break-all">{{ operator.email }}</p>
        </div>
        <div class="flex items-center gap-2">
          <Tag
            :value="operator.role === 'admin' ? 'Administrador' : 'Operador'"
            :severity="operator.role === 'admin' ? 'info' : 'secondary'"
          />
          <Tag v-if="!operator.isActive" value="Desativado" severity="warn" />
        </div>
        <div class="flex gap-1">
          <Button
            icon="pi pi-pencil"
            text
            rounded
            aria-label="Editar"
            @click="openEdit(operator)"
          />
          <Button
            v-if="operator.id !== user?.id"
            icon="pi pi-trash"
            text
            rounded
            severity="danger"
            aria-label="Excluir"
            @click="confirmRemove(operator)"
          />
        </div>
      </li>
    </ul>

    <OperatorDialog
      v-model:visible="dialogVisible"
      :operator="editing"
      :saving="isSaving"
      :isSelf="!!editing && editing.id === user?.id"
      @save="save"
    />
  </section>
</template>
