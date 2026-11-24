<script lang="ts">
export default {
  name: "ChronologicalCyclesList",
};
</script>
<script setup lang="ts">
import { computed } from "vue";
import Skeleton from "primevue/skeleton";
import FeedBack from "@/components/FeedBack.vue";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";
import { formatDateToDisplay } from "@/helpers/date.helper";

const { history, historyLoading } = useChronologicalCycle();

// Datas da mais recente para a mais antiga.
const dates = computed(() => Object.keys(history.value).sort().reverse());
</script>
<template>
  <div v-if="historyLoading" class="grid gap-3">
    <Skeleton v-for="n in 3" :key="n" height="120px" borderRadius="12px" />
  </div>

  <FeedBack
    v-else-if="!dates.length"
    icon="folder_open"
    title="Nenhum ciclo registrado"
    description="Os ciclos lançados na aba Ciclo cronológico aparecem aqui, agrupados por data."
  />

  <div v-else class="grid gap-6">
    <section
      v-for="date in dates"
      :key="date"
      class="rounded-xl border border-surface-200 overflow-hidden"
    >
      <h3 class="font-semibold text-primary-900 bg-primary-50 px-4 py-3">
        {{ formatDateToDisplay(date) }}
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="text-sm text-surface-600">
            <tr class="border-b border-surface-200">
              <th class="px-4 py-2 font-semibold w-28">Fase</th>
              <th class="px-4 py-2 font-semibold w-28">Ciclo</th>
              <th class="px-4 py-2 font-semibold">Escala emocional</th>
              <th class="px-4 py-2 font-semibold">Escala física</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cycle in history[date]"
              :key="cycle.id"
              class="border-b border-surface-100 last:border-0"
            >
              <td class="px-4 py-3">{{ cycle.fase }}</td>
              <td class="px-4 py-3">{{ cycle.cycle }}</td>
              <td class="px-4 py-3">{{ cycle.emotionalScale }}</td>
              <td class="px-4 py-3">{{ cycle.physicalScale }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
