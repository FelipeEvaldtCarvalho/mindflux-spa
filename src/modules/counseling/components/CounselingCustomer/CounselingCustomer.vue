<script lang="ts">
export default {
  name: "CounselingCustomer",
};
</script>
<script setup lang="ts">
import Tabs from "primevue/tabs";
import CounselingCustomerTabs from "./CounselingCustomerTabs.vue";
import CounselingCustomerInitialInterview from "./CounselingCustomerInitialInterview.vue";
import CounselingCustomerChronologicalCycles from "./CounselingCustomerChronologicalCycles.vue";
import TabPanels from "primevue/tabpanels";
import { useCounseling } from "@/modules/counseling/hooks/counseling.hook";
import ChronologicalCyclesList from "./ChronologicalCyclesList.vue";
import Skeleton from "primevue/skeleton";
import { onMounted } from "vue";
const { loading, customer, getData } = useCounseling();
onMounted(getData);
</script>
<template>
  <section class="grid m-6 gap-4 h-fit">
    <Skeleton v-if="loading" class="!h-8 !w-1/2" />
    <h1 v-else class="text-2xl font-bold text-primary-900">
      {{ customer.name }}
    </h1>
    <Tabs value="0" scrollable class="max-w-full overflow-x-hidden">
      <CounselingCustomerTabs />
      <TabPanels class="!p-0 mt-8">
        <CounselingCustomerInitialInterview />
        <CounselingCustomerChronologicalCycles />
        <ChronologicalCyclesList />
      </TabPanels>
    </Tabs>
  </section>
</template>
