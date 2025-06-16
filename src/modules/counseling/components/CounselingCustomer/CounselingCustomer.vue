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
import Skeleton from "primevue/skeleton";
import { onMounted } from "vue";
import { ref } from "vue";
const { loading, customer, getData } = useCounseling();
onMounted(getData);

const mockChronologicalCycles = ref([
  {
    id: 1,
    customer: { id: 101 }, // ou pode ser o objeto completo se necessário
    date: new Date("2025-06-01"),
    cycle: "3",
    fase: "5-10",
    emotionalScale: "Calmo",
    physicalScale: "Relaxado",
    order: 1,
  },
  {
    id: 2,
    customer: { id: 101 },
    date: new Date("2025-06-01"),
    cycle: "1",
    fase: "0-5",
    emotionalScale:
      "10 - ansiedade, lembrou da vida sofrida na fazenda do tio carlinhos",
    physicalScale:
      "9 - Tensão no peito, sensação de vazio no estomago, falta de ar e espasmos musculares nos membros inferiores.",
    order: 2,
  },
  {
    id: 3,
    customer: { id: 101 },
    date: new Date("2025-06-01"),
    cycle: "2",
    fase: "0-5",
    emotionalScale: "Triste",
    physicalScale: "Aperto no estômago",
    order: 3,
  },
  {
    id: 4,
    customer: { id: 101 },
    date: new Date("2025-06-01"),
    cycle: "1",
    fase: "5-10",
    emotionalScale: "Aliviado",
    physicalScale: "Corpo leve",
    order: 4,
  },
  {
    id: 5,
    customer: { id: 101 },
    date: new Date("2025-06-01"),
    cycle: "2",
    fase: "5-10",
    emotionalScale: "Esperançoso",
    physicalScale: "Equilibrado",
    order: 5,
  },
]);

const addNewCycle = (cycleData: any) => {
  const newCycle = {
    id: Math.max(...mockChronologicalCycles.value.map((c) => c.id)) + 1,
    customer: { id: 101 },
    date: new Date(),
    order: mockChronologicalCycles.value.length + 1,
    ...cycleData,
  };

  mockChronologicalCycles.value.push(newCycle);
};
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
        <CounselingCustomerChronologicalCycles />
      </TabPanels>
    </Tabs>
  </section>
</template>
