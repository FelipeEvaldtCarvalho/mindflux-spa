<script lang="ts">
export default {
  name: "DraggableList",
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { useConfirm } from "primevue/useconfirm";
import EditCycleDialog from "./EditCycleDialog.vue";
import type { ChronologicalCycle } from "../../services/chronological-cycle.types";

// Lista de ciclos do dia, reordenável.
// No iPad: arraste pela alça (⠿) ou toque na linha e use Subir/Descer.
// A ordem é salva automaticamente (ver reorder no hook).
const props = defineProps<{
  modelValue: ChronologicalCycle[];
  loading?: boolean;
  saving?: boolean;
  savingOrder?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: ChronologicalCycle[]];
  edit: [value: ChronologicalCycle];
  delete: [id: number];
}>();

const confirm = useConfirm();
const selectedId = ref<number | null>(null);
const showEditDialog = ref(false);

const selectedIndex = computed(() =>
  props.modelValue.findIndex((item) => item.id === selectedId.value)
);
const selected = computed(() => props.modelValue[selectedIndex.value]);

const move = (from: number, to: number) => {
  if (from === to || to < 0 || to >= props.modelValue.length) return;
  const items = [...props.modelValue];
  const [item] = items.splice(from, 1);
  items.splice(to, 0, item);
  emit("update:modelValue", items);
};

const toggleSelect = (id: number) => {
  selectedId.value = selectedId.value === id ? null : id;
};

// ---------- Arrastar pela alça (Pointer Events: toque, caneta e mouse) ----------
const listEl = ref<HTMLElement | null>(null);
const draggingId = ref<number | null>(null);

const onHandleDown = (event: PointerEvent, id: number) => {
  if (props.saving) return;
  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  draggingId.value = id;
  selectedId.value = id;
};

const onHandleMove = (event: PointerEvent) => {
  if (draggingId.value === null || !listEl.value) return;
  const rows = Array.from(listEl.value.querySelectorAll<HTMLElement>("[data-row]"));
  const from = props.modelValue.findIndex((item) => item.id === draggingId.value);
  // Linha sob o dedo: troca de posição ao passar do meio dela.
  const to = rows.findIndex((row) => {
    const rect = row.getBoundingClientRect();
    return event.clientY >= rect.top && event.clientY <= rect.bottom;
  });
  if (to === -1 || to === from) return;
  const rect = rows[to].getBoundingClientRect();
  const pastMiddle = event.clientY > rect.top + rect.height / 2;
  if ((to > from && pastMiddle) || (to < from && !pastMiddle)) move(from, to);
};

const onHandleUp = () => {
  draggingId.value = null;
};

const confirmDelete = () => {
  const cycle = selected.value;
  if (!cycle) return;
  confirm.require({
    header: "Excluir ciclo",
    message: `Excluir o ciclo "${cycle.cycle ?? ""}" (fase ${cycle.fase ?? "-"})?`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: { label: "Cancelar", severity: "secondary", outlined: true },
    acceptProps: { label: "Excluir", severity: "danger" },
    accept: () => {
      emit("delete", cycle.id);
      selectedId.value = null;
    },
  });
};
</script>

<template>
  <div class="grid gap-3">
    <!-- Ações do item selecionado -->
    <div class="flex flex-wrap items-center gap-2 min-h-11">
      <template v-if="selected">
        <Button
          icon="pi pi-arrow-up"
          label="Subir"
          severity="secondary"
          outlined
          :disabled="selectedIndex === 0 || saving"
          @click="move(selectedIndex, selectedIndex - 1)"
        />
        <Button
          icon="pi pi-arrow-down"
          label="Descer"
          severity="secondary"
          outlined
          :disabled="selectedIndex === modelValue.length - 1 || saving"
          @click="move(selectedIndex, selectedIndex + 1)"
        />
        <Button
          icon="pi pi-pencil"
          label="Editar"
          severity="secondary"
          outlined
          :disabled="saving"
          @click="showEditDialog = true"
        />
        <Button
          icon="pi pi-trash"
          label="Excluir"
          severity="danger"
          outlined
          :disabled="saving"
          @click="confirmDelete"
        />
      </template>
      <span v-else-if="modelValue.length" class="text-surface-500">
        Toque em um ciclo para editar ou mover. Arraste pela alça ⠿ para reordenar.
      </span>
      <span v-if="savingOrder" class="ml-auto text-sm text-surface-500">
        <i class="pi pi-spin pi-spinner" /> Salvando ordem…
      </span>
    </div>

    <div class="rounded-xl border border-surface-200 overflow-hidden relative">
      <div
        class="grid grid-cols-[3rem_minmax(5rem,1fr)_minmax(5rem,1fr)_1.5fr_1.5fr] gap-2 px-2 py-3 bg-surface-50 border-b border-surface-200 text-sm font-semibold text-surface-700"
      >
        <span></span>
        <span>Fase</span>
        <span>Ciclo</span>
        <span>Escala emocional</span>
        <span>Escala física</span>
      </div>

      <div v-if="loading" class="p-8 flex justify-center">
        <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="5" />
      </div>

      <p v-else-if="!modelValue.length" class="p-8 text-center text-surface-500">
        Nenhum ciclo registrado nesta data.
      </p>

      <ul v-else ref="listEl">
        <li
          v-for="item in modelValue"
          :key="item.id"
          data-row
          class="grid grid-cols-[3rem_minmax(5rem,1fr)_minmax(5rem,1fr)_1.5fr_1.5fr] gap-2 px-2 items-center border-b border-surface-100 last:border-0 cursor-pointer select-none transition-colors"
          :class="{
            'bg-primary-50': selectedId === item.id,
            'shadow-lg relative z-10 bg-surface-0': draggingId === item.id,
          }"
          @click="toggleSelect(item.id)"
        >
          <span
            class="drag-handle flex items-center justify-center h-14 text-surface-400 text-xl cursor-grab"
            aria-label="Arrastar para reordenar"
            @pointerdown="onHandleDown($event, item.id)"
            @pointermove="onHandleMove"
            @pointerup="onHandleUp"
            @pointercancel="onHandleUp"
            @click.stop
            >⠿</span
          >
          <span class="py-3">{{ item.fase }}</span>
          <span class="py-3">{{ item.cycle }}</span>
          <span class="py-3">{{ item.emotionalScale }}</span>
          <span class="py-3">{{ item.physicalScale }}</span>
        </li>
      </ul>

      <div
        v-if="saving"
        class="absolute inset-0 flex justify-center items-center bg-surface-0/60"
      >
        <ProgressSpinner style="width: 48px; height: 48px" strokeWidth="5" />
      </div>
    </div>

    <EditCycleDialog
      v-model:visible="showEditDialog"
      :cycle="selected"
      @save="(cycle) => emit('edit', cycle)"
    />
  </div>
</template>

<style scoped>
/* Só a alça captura o toque: o resto da lista continua rolando normalmente. */
.drag-handle {
  touch-action: none;
  -webkit-touch-callout: none;
}
.select-none {
  -webkit-user-select: none;
  user-select: none;
}
</style>
