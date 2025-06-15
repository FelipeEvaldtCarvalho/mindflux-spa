<script lang="ts">
export default {
  name: "CounselingCustomer",
};
</script>
<script setup lang="ts">
import Tabs from "primevue/tabs";
import CounselingCustomerTabs from "./CounselingCustomerTabs.vue";
import CounselingCustomerInitialInterview from "./CounselingCustomerInitialInterview.vue";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import { useCounseling } from "@/modules/counseling/hooks/counseling.hook";
import Skeleton from "primevue/skeleton";
const { loading, customer } = useCounseling();
</script>
<template>
  <section class="grid m-6 gap-4 h-fit">
    <Skeleton v-if="loading" class="!h-8 !w-1/2" />
    <h1 v-else class="text-2xl font-bold text-primary-900">
      {{ customer.name }}
    </h1>
    <Tabs value="0">
      <CounselingCustomerTabs />
      <TabPanels class="!p-0 mt-8">
        <CounselingCustomerInitialInterview />
        <TabPanel value="1"> Ciclos cronológicos </TabPanel>
      </TabPanels>
    </Tabs>
  </section>
</template>
