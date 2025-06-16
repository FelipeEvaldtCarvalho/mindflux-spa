<script lang="ts">
export default {
  name: "CounselingCustomer",
};
</script>
<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import DatePicker from "primevue/datepicker";
import DraggableList from "./DraggableList.vue";
import CycleForm from "./CycleForm.vue";
import { ref, onMounted } from "vue";
import type { ChronologicalCycle } from "@/modules/counseling/services/chronological-cycle.types";

import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const { selectedDate, getData } = useChronologicalCycle();

onMounted(getData);

const mockChronologicalCycles = ref<ChronologicalCycle[]>([
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
  <TabPanel value="1">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="name"
          >Selecione a data do atendimento:</label
        >
        <DatePicker
          showIcon
          iconDisplay="input"
          class="w-full md:w-[350px]"
          :showButtonBar="false"
          v-model="selectedDate"
        />
      </div>
      <DraggableList v-model="mockChronologicalCycles" />
      <CycleForm />
    </div>
  </TabPanel>
</template>
