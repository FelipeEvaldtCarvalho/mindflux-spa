<script lang="ts">
export default {
  name: "CycleForm",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const { fase, cycle, emotionalScale, physicalScale, createCycle, isSaving } =
  useChronologicalCycle();

const isFormValid = computed(() => !!fase.value.trim() && !!cycle.value.trim());

const addCycle = async () => {
  if (!isFormValid.value || isSaving.value) return;
  if (await createCycle()) {
    // Volta o foco para o primeiro campo: agiliza lançar vários ciclos seguidos.
    document.getElementById("new-fase")?.focus();
  }
};
</script>

<template>
  <form
    class="grid gap-3 p-4 rounded-xl border border-surface-200 bg-surface-50"
    @submit.prevent="addCycle"
  >
    <h3 class="section-title">Adicionar ciclo</h3>
    <div class="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end">
      <div class="grid gap-1">
        <label for="new-fase" class="text-sm font-medium">Fase *</label>
        <InputText id="new-fase" v-model="fase" :disabled="isSaving" fluid />
      </div>
      <div class="grid gap-1">
        <label for="new-cycle" class="text-sm font-medium">Ciclo *</label>
        <InputText id="new-cycle" v-model="cycle" :disabled="isSaving" fluid />
      </div>
      <div class="grid gap-1">
        <label for="new-emotional" class="text-sm font-medium">Escala emocional</label>
        <InputText
          id="new-emotional"
          v-model="emotionalScale"
          placeholder="0 a 10"
          :disabled="isSaving"
          fluid
        />
      </div>
      <div class="grid gap-1">
        <label for="new-physical" class="text-sm font-medium">Escala física</label>
        <InputText
          id="new-physical"
          v-model="physicalScale"
          placeholder="0 a 10"
          :disabled="isSaving"
          fluid
          enterkeyhint="done"
        />
      </div>
      <Button
        type="submit"
        icon="pi pi-plus"
        label="Adicionar"
        class="col-span-2 md:col-span-1"
        :loading="isSaving"
        :disabled="!isFormValid"
      />
    </div>
    <p class="text-sm text-surface-500">Fase e ciclo são obrigatórios.</p>
  </form>
</template>
