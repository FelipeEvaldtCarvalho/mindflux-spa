<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import Menu from "primevue/menu";
import Dialog from "primevue/dialog";
import FeedBack from "../../../components/FeedBack.vue";
import ProgressSpinner from "primevue/progressspinner";
import { FilterMatchMode } from "@primevue/core/api";
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useCustomers } from "../hooks/customers.hook";
import { phoneMask } from "../../../helpers/masks.helper";
import type { Customer } from "../services/customers.types";
import EditCustomerDialog from "./EditCustomerDialog.vue";

const router = useRouter();
const {
  customers,
  deleteCustomer,
  updateCustomer,
  isLoading,
  hasError,
  getData,
} = useCustomers();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const actionMenuRefs = ref<any[]>([]);
const showDeleteDialog = ref(false);
const showEditDialog = ref(false);
const selectedCustomer = ref<Customer | null>(null);

const setMenuRef = (el: any, index: number) => {
  if (el) actionMenuRefs.value[index] = el;
};

const showMenu = (event: Event, index: number) => {
  nextTick(() => {
    actionMenuRefs.value[index]?.toggle(event);
  });
};

const confirmDelete = (customer: Customer) => {
  selectedCustomer.value = customer;
  showDeleteDialog.value = true;
};

const handleDelete = async () => {
  if (selectedCustomer.value) {
    await deleteCustomer(selectedCustomer.value.id);
    showDeleteDialog.value = false;
    selectedCustomer.value = null;
  }
};

const openEditDialog = (customer: Customer) => {
  selectedCustomer.value = customer;
  showEditDialog.value = true;
};

const handleEdit = async (id: string, data: any) => {
  await updateCustomer(id, data);
  showEditDialog.value = false;
  selectedCustomer.value = null;
};

const getMenuItems = (customer: Customer) => [
  {
    label: "Editar",
    icon: "pi pi-pencil",
    command: () => openEditDialog(customer),
  },
  {
    label: "Excluir",
    icon: "pi pi-trash",
    command: () => confirmDelete(customer),
  },
  {
    label: "Ver Anamnese",
    icon: "pi pi-file",
    disabled: true,
    command: () => console.log("anamnese"),
  },
  {
    label: "Ver Atendimentos",
    icon: "pi pi-eye",
    command: () => router.push(`/counseling/customer/${customer.id}`),
  },
];
</script>

<template>
  <TabPanel value="0">
    <div class="mb-4 flex gap-2">
      <IconField class="w-full md:w-[350px]">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="filters['global'].value"
          placeholder="Buscar por nome..."
          class="w-full"
          :disabled="isLoading"
        />
      </IconField>

      <Button
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="filters['global'].value = null"
        type="button"
        :disabled="!filters['global'].value"
        aria-label="Limpar filtro"
      />
    </div>

    <DataTable
      v-model:filters="filters"
      :value="customers"
      :globalFilterFields="['name']"
      :paginator="customers.length > 0"
      :rows="10"
      size="small"
    >
      <Column field="name" header="Nome">
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            placeholder="Filtrar por nome"
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column field="phone" header="Contato">
        <template #body="{ data }">
          {{ phoneMask(data.phone) }}
        </template>
      </Column>

      <Column header="Ações" body-class="text-right" style="width: 60px">
        <template #body="{ data, index }">
          <Button
            icon="pi pi-ellipsis-v"
            severity="secondary"
            text
            @click="showMenu($event, index)"
            aria-haspopup="true"
          />
          <Menu
            :ref="(el) => setMenuRef(el, index)"
            :model="getMenuItems(data)"
            popup
          />
        </template>
      </Column>
      <template #empty>
        <FeedBack
          v-if="!isLoading && !hasError"
          icon="folder_open"
          title="Nenhum cliente encontrado!"
          description="Use um novo filtro ou cadastre um novo cliente para vê-lo aqui."
        />
        <div
          class="flex justify-center items-center h-full my-32"
          v-if="isLoading"
        >
          <ProgressSpinner
            style="width: 70px; height: 70px"
            strokeWidth="5"
            fill="transparent"
            aria-label="ProgressSpinner"
          />
        </div>
        <FeedBack
          v-if="hasError"
          icon="warning"
          title="Erro ao carregar clientes!"
          description="Tente novamente mais tarde."
          :action="getData"
          actionText="Tentar novamente"
          actionIcon="pi pi-refresh"
        />
      </template>
    </DataTable>

    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Confirmar Exclusão"
      :style="{ width: '450px' }"
    >
      <div class="flex flex-col gap-4">
        <p>
          Tem certeza que deseja excluir o cliente
          <strong>{{ selectedCustomer?.name }}</strong
          >?
        </p>
        <p class="text-sm text-gray-600">Esta ação não poderá ser desfeita.</p>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          outlined
          @click="showDeleteDialog = false"
          class="mr-2"
        />
        <Button
          label="Confirmar"
          icon="pi pi-check"
          severity="danger"
          @click="handleDelete"
          autofocus
        />
      </template>
    </Dialog>

    <EditCustomerDialog
      v-model:visible="showEditDialog"
      :customer="selectedCustomer"
      @save="handleEdit"
    />
  </TabPanel>
</template>
