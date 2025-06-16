<script lang="ts">
export default {
  name: "CycleForm",
};
</script>

<script setup lang="ts">
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const { fase, cycle, emotionalScale, physicalScale, createCycle } =
  useChronologicalCycle();

const addCycle = async () => {
  if (!fase.value || !cycle.value) {
    return;
  }
  await createCycle();
};

const isFormValid = () => {
  return fase.value?.trim() !== "" && cycle.value?.trim() !== "";
};
</script>

<template>
  <div class="flex gap-4">
    <div class="flex flex-col gap-2 pt-3">
      <Button
        icon="pi pi-plus"
        severity="success"
        rounded
        @click="addCycle"
        :disabled="!isFormValid()"
        title="Adicionar novo ciclo"
      />
    </div>

    <div class="flex-1 border border-gray-300 rounded-md overflow-hidden">
      <div class="bg-gray-50 border-b border-gray-300">
        <div class="grid grid-cols-[100px_80px_1fr_1fr] gap-2 p-3">
          <InputText v-model="fase" placeholder="Fase" class="text-sm" />
          <InputText v-model="cycle" placeholder="Ciclo" class="text-sm" />
          <InputText
            v-model="emotionalScale"
            placeholder="Escala Emocional"
            class="text-sm"
          />
          <InputText
            v-model="physicalScale"
            placeholder="Escala Física"
            class="text-sm"
          />
        </div>
      </div>

      <!-- Dica de uso -->
      <div class="p-2 text-xs text-gray-400 text-center">
        Preencha pelo menos Fase e Ciclo para adicionar
      </div>
    </div>
  </div>
</template>
