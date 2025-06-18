<script setup lang="ts">
import CustomersTabs from "./components/CustomersTabs.vue";
import CustomersList from "./components/CustomersList.vue";
import CustomersForm from "./components/CustomersForm.vue";
import Tabs from "primevue/tabs";
import TabPanels from "primevue/tabpanels";
</script>
<template>
  <section class="grid m-6 gap-4 h-fit">
    <h1 class="text-xl font-bold text-primary-900">Clientes:</h1>
    <Tabs value="0">
      <CustomersTabs />
      <TabPanels class="!px-0">
        <CustomersList />
        <CustomersForm />
      </TabPanels>
    </Tabs>
  </section>
</template>
