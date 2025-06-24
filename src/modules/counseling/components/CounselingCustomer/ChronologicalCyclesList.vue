<script lang="ts">
export default {
  name: "ChronologicalCyclesList",
};
</script>
<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import { formatDateToDisplay } from "@/helpers/date.helper";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";
import { onMounted } from "vue";

const { getList, viewList } = useChronologicalCycle();

onMounted(getList);
</script>
<template>
  <TabPanel value="2">
    <div
      v-for="(value, key) in viewList"
      :key="key"
      class="flex flex-col gap-2"
    >
      <span
        class="text-sm font-bold text-primary-900 w-full bg-primary-100 p-3 rounded-md"
        >{{ formatDateToDisplay(key) }}</span
      >
      <ul>
        <li
          class="grid grid-cols-[60px_60px_1fr_1fr] gap-2 p-3 border-b border-gray-300"
        >
          <span class="text-sm font-bold text-primary-900">Ciclo</span>
          <span class="text-sm font-bold text-primary-900">Fase</span>
          <span class="text-sm font-bold text-primary-900"
            >Escala Emocional</span
          >
          <span class="text-sm font-bold text-primary-900">Escala Física</span>
        </li>
        <li
          v-for="cycle in value"
          :key="cycle.id"
          class="grid grid-cols-[60px_60px_1fr_1fr] gap-2 p-3 border-b border-gray-300"
        >
          <span>{{ cycle.cycle }}</span>
          <span>{{ cycle.fase }}</span>
          <span>{{ cycle.emotionalScale }}</span>
          <span>{{ cycle.physicalScale }}</span>
        </li>
      </ul>
    </div>
  </TabPanel>
</template>
