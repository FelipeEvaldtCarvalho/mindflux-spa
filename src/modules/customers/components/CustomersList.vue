<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Button from "primevue/button";
import Menu from "primevue/menu";
import FeedBack from "@/components/FeedBack.vue";
import { FilterMatchMode } from "@primevue/core/api";
import { ref, nextTick } from "vue";
import { useCustomers } from "../hooks/customers.hook";
import { phoneMask } from "@/helpers/masks.helper";
const { customers } = useCustomers();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

const actionMenuRefs = ref<any[]>([]);

const setMenuRef = (el: any, index: number) => {
  if (el) actionMenuRefs.value[index] = el;
};

const showMenu = (event: Event, index: number) => {
  nextTick(() => {
    actionMenuRefs.value[index]?.toggle(event);
  });
};

const menuItems = [
  {
    label: "Editar",
    icon: "pi pi-pencil",
    command: () => console.log("editar"),
  },
  {
    label: "Excluir",
    icon: "pi pi-trash",
    command: () => console.log("excluir"),
  },
  {
    label: "Ver Anamnese",
    icon: "pi pi-file",
    command: () => console.log("anamnese"),
  },
  {
    label: "Ver Atendimento",
    icon: "pi pi-eye",
    command: () => console.log("atendimento"),
  },
];
</script>

<template>
  <TabPanel value="0">
    <div class="mb-4 flex justify-end gap-2">
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="filters['global'].value"
          placeholder="Buscar por nome..."
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
      v-if="customers.length"
      v-model:filters="filters"
      :value="customers"
      :globalFilterFields="['name']"
      paginator
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
        <template #body="{ index }">
          <Button
            icon="pi pi-ellipsis-v"
            severity="secondary"
            text
            @click="showMenu($event, index)"
            aria-haspopup="true"
          />
          <Menu :ref="(el) => setMenuRef(el, index)" :model="menuItems" popup />
        </template>
      </Column>
    </DataTable>

    <FeedBack
      v-else
      icon="folder_open"
      title="Nenhum cliente encontrado!"
      description="Cadastre novos clientes para vê-los aqui."
    />
  </TabPanel>
</template>
