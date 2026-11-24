<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import Skeleton from "primevue/skeleton";
import { useConfirm } from "primevue/useconfirm";
import FeedBack from "@/components/FeedBack.vue";
import CustomerFormDialog from "./components/CustomerFormDialog.vue";
import ViewCustomerDialog from "./components/ViewCustomerDialog.vue";
import { useCustomers } from "./hooks/customers.hook";
import { normalizeSearch, onlyDigits, phoneMask } from "@/helpers/masks.helper";
import type { Customer, CustomerPayload } from "./services/customers.types";

const router = useRouter();
const confirm = useConfirm();
const {
  customers,
  isLoading,
  isSaving,
  hasError,
  getData,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = useCustomers();

const search = ref("");
const PAGE = 50;
const visibleCount = ref(PAGE);
const selected = ref<Customer | null>(null);
const showView = ref(false);
const showForm = ref(false);
const editing = ref<Customer | null>(null);

// Busca por nome (sem acento), telefone ou CPF.
const filtered = computed(() => {
  const term = normalizeSearch(search.value);
  if (!term) return customers.value;
  const digits = onlyDigits(term);
  return customers.value.filter(
    (c) =>
      normalizeSearch(c.name).includes(term) ||
      (digits.length >= 3 &&
        (onlyDigits(c.phone).includes(digits) || onlyDigits(c.document).includes(digits)))
  );
});

const visible = computed(() => filtered.value.slice(0, visibleCount.value));
watch(search, () => (visibleCount.value = PAGE));

const openView = (customer: Customer) => {
  selected.value = customer;
  showView.value = true;
};

const openNew = () => {
  editing.value = null;
  showForm.value = true;
};

const openEdit = (customer: Customer) => {
  showView.value = false;
  editing.value = customer;
  showForm.value = true;
};

const openCounseling = (customer: Customer) => {
  router.push({ name: "counseling.customer", params: { id: customer.id } });
};

const save = async (payload: CustomerPayload) => {
  const ok = editing.value
    ? await updateCustomer(editing.value.id, payload)
    : await createCustomer(payload);
  if (ok) showForm.value = false;
};

const confirmRemove = (customer: Customer) => {
  confirm.require({
    header: "Excluir cliente",
    message: `Excluir ${customer.name}? A ficha, os ciclos e os agendamentos dele também serão apagados. Esta ação não pode ser desfeita.`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancelar", severity: "secondary", outlined: true },
    acceptProps: { label: "Excluir", severity: "danger" },
    accept: async () => {
      if (await deleteCustomer(customer.id)) showView.value = false;
    },
  });
};

onMounted(getData);
</script>

<template>
  <section class="grid gap-6 p-6 lg:p-8">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="page-title">Clientes</h1>
      <Button label="Novo cliente" icon="pi pi-plus" @click="openNew" />
    </header>

    <IconField class="w-full md:max-w-md">
      <InputIcon class="pi pi-search" />
      <InputText
        v-model="search"
        type="search"
        placeholder="Buscar por nome, telefone ou CPF"
        autocomplete="off"
        autocorrect="off"
        fluid
      />
    </IconField>

    <div v-if="isLoading && !customers.length" class="grid gap-2">
      <Skeleton v-for="n in 6" :key="n" height="56px" borderRadius="10px" />
    </div>

    <FeedBack
      v-else-if="hasError"
      icon="warning"
      title="Erro ao carregar clientes"
      description="Verifique a conexão e tente novamente."
      :action="getData"
      actionText="Tentar novamente"
      actionIcon="pi pi-refresh"
    />

    <template v-else>
      <ul v-if="visible.length" class="rounded-xl border border-surface-200 divide-y divide-surface-200 overflow-hidden">
        <li v-for="customer in visible" :key="customer.id" class="flex items-center bg-surface-0">
          <button
            type="button"
            class="flex-1 min-w-0 text-left px-4 py-4 hover:bg-surface-50 active:bg-surface-100"
            @click="openView(customer)"
          >
            <span class="block font-semibold truncate">{{ customer.name }}</span>
            <span class="block text-surface-600 text-sm">{{ phoneMask(customer.phone) }}</span>
          </button>
          <Button
            label="Atendimento"
            icon="pi pi-arrow-right"
            iconPos="right"
            text
            class="shrink-0 !mr-2"
            @click="openCounseling(customer)"
          />
        </li>
      </ul>
      <FeedBack
        v-else
        icon="folder_open"
        :title="search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'"
        :description="
          search
            ? 'Confira a busca ou cadastre um novo cliente.'
            : 'Cadastre o primeiro cliente para começar.'
        "
      />
      <div v-if="filtered.length > visible.length" class="flex justify-center">
        <Button
          :label="`Mostrar mais (${filtered.length - visible.length})`"
          severity="secondary"
          outlined
          @click="visibleCount += PAGE"
        />
      </div>
    </template>

    <ViewCustomerDialog
      v-model:visible="showView"
      :customer="selected"
      @open="openCounseling"
      @edit="openEdit"
      @remove="confirmRemove"
    />

    <CustomerFormDialog
      v-model:visible="showForm"
      :customer="editing"
      :saving="isSaving"
      @save="save"
    />
  </section>
</template>
