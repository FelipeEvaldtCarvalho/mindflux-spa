<script lang="ts">
export default {
  name: "EditCycleDialog",
};
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

interface CycleItem {
  id: number;
  customer: { id: number };
  date: Date;
  cycle: string;
  fase: string;
  emotionalScale: string;
  physicalScale: string;
  order: number;
}

const props = defineProps<{
  visible: boolean;
  cycle?: CycleItem;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  save: [value: CycleItem];
}>();

const formData = ref({
  cycle: "",
  fase: "",
  emotionalScale: "",
  physicalScale: "",
});

watch(
  () => props.cycle,
  (newCycle) => {
    if (newCycle) {
      formData.value = {
        cycle: newCycle.cycle,
        fase: newCycle.fase,
        emotionalScale: newCycle.emotionalScale,
        physicalScale: newCycle.physicalScale,
      };
    }
  }
);

const onSave = () => {
  if (props.cycle) {
    emit("save", {
      ...props.cycle,
      ...formData.value,
    });
  }
  emit("update:visible", false);
};

const onHide = () => {
  emit("update:visible", false);
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(value) => emit('update:visible', value)"
    modal
    header="Editar Ciclo"
    :style="{ width: '450px' }"
    :closable="true"
    @hide="onHide"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="fase">Fase Cronológica</label>
        <InputText id="fase" v-model="formData.fase" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="cycle">Ciclo</label>
        <InputText id="cycle" v-model="formData.cycle" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="emotionalScale"
          >Escala Emocional (0-10)</label
        >
        <InputText id="emotionalScale" v-model="formData.emotionalScale" />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold" for="physicalScale"
          >Escala Física (0-10)</label
        >
        <InputText id="physicalScale" v-model="formData.physicalScale" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="onHide"
          class="p-button-text"
        />
        <Button label="Salvar" icon="pi pi-check" @click="onSave" />
      </div>
    </template>
  </Dialog>
</template>
