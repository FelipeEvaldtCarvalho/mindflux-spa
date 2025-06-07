<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import FeedBack from "@/components/FeedBack.vue";
import { useCustomers } from "../hooks/customers.hook";

const { customers } = useCustomers();

const columns = [
  { field: "name", header: "Nome" },
  { field: "phone", header: "Contato" },
];
</script>
<template>
  <TabPanel value="0">
    <DataTable :value="customers" v-if="customers.length">
      <Column
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
      ></Column>
    </DataTable>
    <FeedBack
      v-else
      icon="folder_open"
      title="Nenhum cliente encontrado!"
      description="Cadastre novos clientes para ve-los aqui."
    />
  </TabPanel>
</template>
