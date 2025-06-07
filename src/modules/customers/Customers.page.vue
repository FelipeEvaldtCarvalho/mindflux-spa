<script setup lang="ts">
import CustomersTabs from "./components/CustomersTabs.vue";
import CustomersList from "./components/CustomersList.vue";
import CustomersForm from "./components/CustomersForm.vue";
import Tabs from "primevue/tabs";
import TabPanels from "primevue/tabpanels";
</script>
<template>
  <section class="grid m-6 gap-4 w-full h-fit">
    <Tabs value="0">
      <CustomersTabs />
      <TabPanels>
        <CustomersList />
        <CustomersForm />
      </TabPanels>
    </Tabs>
  </section>
</template>
