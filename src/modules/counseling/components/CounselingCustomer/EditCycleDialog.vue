<script lang="ts">
export default {
  name: "EditCycleDialog",
};
</script>

<script setup lang="ts">
import { reactive, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import type { ChronologicalCycle } from "../../services/chronological-cycle.types";

const props = defineProps<{
  visible: boolean;
  cycle?: ChronologicalCycle;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  save: [value: ChronologicalCycle];
}>();

const formData = reactive({ cycle: "", fase: "", emotionalScale: "", physicalScale: "" });

// Recarrega os campos a cada abertura (antes, reabrir o mesmo ciclo mostrava
// o texto editado e cancelado da vez anterior).
watch(
  () => props.visible,
  (open) => {
    if (!open || !props.cycle) return;
    formData.cycle = props.cycle.cycle ?? "";
    formData.fase = props.cycle.fase ?? "";
    formData.emotionalScale = props.cycle.emotionalScale ?? "";
    formData.physicalScale = props.cycle.physicalScale ?? "";
  }
);

const onSave = () => {
  if (props.cycle) emit("save", { ...props.cycle, ...formData });
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(value) => emit('update:visible', value)"
    modal
    header="Editar ciclo"
    :style="{ width: 'min(30rem, 94vw)' }"
    :draggable="false"
  >
    <form class="grid gap-4" @submit.prevent="onSave">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-1">
          <label class="font-medium" for="edit-fase">Fase</label>
          <InputText id="edit-fase" v-model="formData.fase" fluid />
        </div>
        <div class="grid gap-1">
          <label class="font-medium" for="edit-cycle">Ciclo</label>
          <InputText id="edit-cycle" v-model="formData.cycle" fluid />
        </div>
        <div class="grid gap-1">
          <label class="font-medium" for="edit-emotional">Escala emocional</label>
          <InputText id="edit-emotional" v-model="formData.emotionalScale" placeholder="0 a 10" fluid />
        </div>
        <div class="grid gap-1">
          <label class="font-medium" for="edit-physical">Escala física</label>
          <InputText id="edit-physical" v-model="formData.physicalScale" placeholder="0 a 10" fluid />
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          outlined
          @click="emit('update:visible', false)"
        />
        <Button type="submit" label="Salvar" icon="pi pi-check" />
      </div>
    </form>
  </Dialog>
</template>
