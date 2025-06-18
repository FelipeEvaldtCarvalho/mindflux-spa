<script lang="ts">
export default {
  name: "DraggableList",
};
</script>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import { useConfirm } from "primevue/useconfirm";

import { useChronologicalCycle } from "../../hooks/chronological-cycle.hook";

const { hasOrderChanged } = useChronologicalCycle();
const confirm = useConfirm();

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
  modelValue: CycleItem[];
  loading?: boolean;
  saving?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: CycleItem[]];
  "save:modelValue": [value: CycleItem[]];
  "edit:selected": [value: CycleItem];
  "delete:selected": [value: number];
  save: [];
}>();

const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);
const selectedIndex = ref<number | null>(null);
const dropIndicatorIndex = ref<number | null>(null);
const isTouchDragging = ref(false);
const touchStartY = ref(0);

const onDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", index.toString());
  }
};

const onDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  dragOverIndex.value = index;

  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const itemMiddle = rect.top + rect.height / 2;

    if (mouseY < itemMiddle) {
      dropIndicatorIndex.value = index;
    } else {
      dropIndicatorIndex.value = index + 1;
    }
  }

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onDragLeave = () => {
  dragOverIndex.value = null;
  dropIndicatorIndex.value = null;
};

const onDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();

  if (draggedIndex.value === null) {
    clearDragStates();
    return;
  }

  const items = [...props.modelValue];
  const draggedItem = items[draggedIndex.value];
  const oldIndex = draggedIndex.value;

  let insertIndex =
    dropIndicatorIndex.value !== null ? dropIndicatorIndex.value : dropIndex;

  items.splice(draggedIndex.value, 1);

  if (draggedIndex.value < insertIndex) {
    insertIndex--;
  }

  items.splice(insertIndex, 0, draggedItem);

  items.forEach((item, index) => {
    item.order = index + 1;
  });

  if (selectedIndex.value === oldIndex) {
    selectedIndex.value = insertIndex;
  }

  emit("update:modelValue", items);
  clearDragStates();
};

const onDragEnd = () => {
  clearDragStates();
};

const clearDragStates = () => {
  draggedIndex.value = null;
  dragOverIndex.value = null;
  dropIndicatorIndex.value = null;
  isTouchDragging.value = false;
  touchStartY.value = 0;

  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
};

const onTouchStart = (event: TouchEvent, index: number) => {
  if (selectedIndex.value !== index) {
    return;
  }

  event.preventDefault();
  const touch = event.touches[0];
  touchStartY.value = touch.clientY;

  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  let touchEndHandler: ((e: TouchEvent) => void) | null = null;

  touchMoveHandler = (moveEvent: TouchEvent) => {
    const moveTouch = moveEvent.touches[0];
    if (Math.abs(moveTouch.clientY - touchStartY.value) > 10) {
      draggedIndex.value = index;
      isTouchDragging.value = true;

      document.removeEventListener("touchmove", touchMoveHandler!);
      document.removeEventListener("touchend", touchEndHandler!);

      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd, { once: true });
    }
  };

  touchEndHandler = () => {
    document.removeEventListener("touchmove", touchMoveHandler!);
    document.removeEventListener("touchend", touchEndHandler!);
  };

  document.addEventListener("touchmove", touchMoveHandler, { passive: false });
  document.addEventListener("touchend", touchEndHandler, { once: true });
};

const onTouchMove = (event: TouchEvent) => {
  if (!isTouchDragging.value || draggedIndex.value === null) return;

  event.preventDefault();
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);

  if (element) {
    const listItem = element.closest("[data-index]");
    if (listItem) {
      const index = parseInt(listItem.getAttribute("data-index") || "0");
      dragOverIndex.value = index;

      const rect = listItem.getBoundingClientRect();
      const itemMiddle = rect.top + rect.height / 2;

      if (touch.clientY < itemMiddle) {
        dropIndicatorIndex.value = index;
      } else {
        dropIndicatorIndex.value = index + 1;
      }
    }
  }
};

const onTouchEnd = (event: TouchEvent) => {
  if (!isTouchDragging.value || draggedIndex.value === null) {
    clearDragStates();
    return;
  }

  const touch = event.changedTouches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);

  if (element) {
    const listItem = element.closest("[data-index]");
    if (listItem && dropIndicatorIndex.value !== null) {
      const items = [...props.modelValue];
      const draggedItem = items[draggedIndex.value];
      const oldIndex = draggedIndex.value;

      let insertIndex = dropIndicatorIndex.value;

      items.splice(draggedIndex.value, 1);

      if (draggedIndex.value < insertIndex) {
        insertIndex--;
      }

      items.splice(insertIndex, 0, draggedItem);

      items.forEach((item, index) => {
        item.order = index + 1;
      });

      if (selectedIndex.value === oldIndex) {
        selectedIndex.value = insertIndex;
      }

      emit("update:modelValue", items);
    }
  }

  clearDragStates();
};

const selectItem = (index: number) => {
  selectedIndex.value = selectedIndex.value === index ? null : index;
};

const onItemClick = (index: number, event: Event) => {
  if (isTouchDragging.value) {
    event.preventDefault();
    return;
  }
  selectItem(index);
};

const moveUp = (index: number) => {
  if (index === 0) return;

  const items = [...props.modelValue];
  [items[index - 1], items[index]] = [items[index], items[index - 1]];

  items.forEach((item, idx) => {
    item.order = idx + 1;
  });

  emit("update:modelValue", items);
  selectedIndex.value = index - 1;
};

const moveDown = (index: number) => {
  if (index === props.modelValue.length - 1) return;

  const items = [...props.modelValue];
  [items[index], items[index + 1]] = [items[index + 1], items[index]];

  items.forEach((item, idx) => {
    item.order = idx + 1;
  });

  emit("update:modelValue", items);
  selectedIndex.value = index + 1;
};

const moveSelectedUp = () => {
  if (selectedIndex.value !== null) {
    moveUp(selectedIndex.value);
  }
};

const moveSelectedDown = () => {
  if (selectedIndex.value !== null) {
    moveDown(selectedIndex.value);
  }
};

const confirmDelete = (event: MouseEvent) => {
  if (selectedIndex.value === null) return;

  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "Tem certeza que deseja excluir este ciclo?",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Excluir",
      severity: "danger",
    },
    accept: () => {
      if (selectedIndex.value !== null) {
        console.log("deletando");
        console.log(props.modelValue[selectedIndex.value].id);
        const id = props.modelValue[selectedIndex.value].id;
        emit("delete:selected", id);
      }
    },
    reject: () => {},
  });
};
</script>

<template>
  <div class="flex gap-4">
    <div class="flex flex-col gap-2">
      <Button
        icon="pi pi-angle-up"
        severity="secondary"
        rounded
        @click="moveSelectedUp"
        :disabled="selectedIndex === null || selectedIndex === 0"
      />
      <Button
        icon="pi pi-angle-down"
        severity="secondary"
        rounded
        @click="moveSelectedDown"
        :disabled="
          selectedIndex === null || selectedIndex === modelValue.length - 1
        "
      />
      <Button
        icon="pi pi-save"
        severity="success"
        rounded
        @click="emit('save')"
        :loading="saving"
        :disabled="loading || saving || hasOrderChanged"
        title="Salvar ordem"
      />
      <Button
        icon="pi pi-pencil"
        rounded
        @click="emit('edit:selected', modelValue[selectedIndex ?? 0])"
        :disabled="selectedIndex === null"
      />
      <Button
        icon="pi pi-trash"
        rounded
        severity="danger"
        @click="confirmDelete($event)"
        :disabled="selectedIndex === null"
      />
    </div>

    <!-- Lista -->
    <div
      class="flex-1 border border-gray-300 rounded-md overflow-hidden relative"
    >
      <!-- Header -->
      <div class="bg-gray-50 border-b border-gray-300">
        <div class="grid grid-cols-[100px_80px_1fr_1fr] gap-2 p-3">
          <p class="font-bold text-sm">Fase Cronológica</p>
          <p class="font-bold text-sm">Ciclos</p>
          <p class="font-bold text-sm">Escala Emocional(0-10)</p>
          <p class="font-bold text-sm">Escala Física(0-10)</p>
        </div>
      </div>

      <!-- Lista -->
      <div
        class="absolute w-full h-full flex justify-center items-center bg-primary-100/50 z-10 cursor-not-allowed"
        v-if="saving"
      >
        <ProgressSpinner
          style="width: 70px; height: 70px"
          strokeWidth="5"
          fill="transparent"
          aria-label="ProgressSpinner"
        />
      </div>
      <div
        class="max-h-80 overflow-y-auto relative"
        :class="{ 'overflow-y-hidden': saving }"
      >
        <div v-if="loading" class="p-8 text-center text-gray-500">
          <ProgressSpinner
            style="width: 70px; height: 70px"
            strokeWidth="5"
            fill="transparent"
            aria-label="ProgressSpinner"
          />
        </div>
        <div
          v-else
          v-for="(item, index) in modelValue"
          :key="item.id"
          :data-index="index"
          :draggable="true"
          @dragstart="onDragStart($event, index)"
          @dragover="onDragOver($event, index)"
          @dragleave="onDragLeave"
          @drop="onDrop($event, index)"
          @dragend="onDragEnd"
          @touchstart="onTouchStart($event, index)"
          @click="onItemClick(index, $event)"
          class="grid grid-cols-[100px_80px_1fr_1fr] gap-2 p-3 border-b border-gray-200 transition-colors hover:bg-gray-50 relative select-none"
          :class="{
            'bg-blue-50 border-blue-200': selectedIndex === index,
            'bg-gray-100': dragOverIndex === index && draggedIndex !== index,
            'opacity-50':
              draggedIndex === index ||
              (isTouchDragging && draggedIndex === index),
            'cursor-move': selectedIndex === index,
            'cursor-pointer': selectedIndex !== index,
            'touch-drag-enabled': selectedIndex === index,
          }"
        >
          <span class="text-sm text-center">{{ item.fase }}</span>
          <span class="text-sm text-center">{{ item.cycle }}</span>
          <span class="text-sm">{{ item.emotionalScale }}</span>
          <span class="text-sm">{{ item.physicalScale }}</span>
          <div
            v-if="dropIndicatorIndex === index && draggedIndex !== null"
            class="absolute -top-0.5 left-2 right-2 h-1 bg-blue-500 rounded-full shadow-sm z-10"
          ></div>
        </div>
        <div
          v-if="
            dropIndicatorIndex === modelValue.length && draggedIndex !== null
          "
          class="absolute bottom-0 left-2 right-2 h-1 bg-blue-500 rounded-full shadow-sm z-10"
        ></div>
      </div>

      <div
        v-if="!modelValue.length && !loading"
        class="p-8 text-center text-gray-500"
      >
        Nenhum ciclo cronológico registrado
      </div>

      <!-- Instrução para dispositivos touch -->
      <div
        v-if="modelValue.length && !loading"
        class="p-2 text-xs text-gray-400 text-center lg:hidden"
      >
        Toque para selecionar um item, depois arraste para reordenar
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.touch-drag-enabled {
  position: relative;
}

.touch-drag-enabled::after {
  content: "⋮⋮";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
  font-size: 14px;
  font-weight: bold;
  opacity: 0.7;
  pointer-events: none;
}

@media (hover: none) and (pointer: coarse) {
  .touch-drag-enabled::after {
    opacity: 1;
  }
}
</style>
