<script lang="ts">
export default {
  name: "CounselingCustomerTabs",
};
</script>
<script setup lang="ts">
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
</script>
<template>
  <TabList>
    <Tab value="0">Entrevista Inicial</Tab>
    <Tab value="1">Ciclos Cronológicos</Tab>
  </TabList>
</template>
