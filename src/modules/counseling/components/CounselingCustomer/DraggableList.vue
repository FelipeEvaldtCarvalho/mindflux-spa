<script lang="ts">
export default {
  name: "DraggableList",
};
</script>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
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
  modelValue: CycleItem[];
}>();

const emit = defineEmits<{
  "update:modelValue": [value: CycleItem[]];
  "save:modelValue": [value: CycleItem[]];
  "edit:selected": [value: CycleItem];
  "delete:selected": [value: CycleItem];
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
    // Calcula onde o item será inserido
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseY = event.clientY;
    const itemMiddle = rect.top + rect.height / 2;

    // Se mouse está na metade superior, insere antes; senão, insere depois
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

  // Usa o indicador de posição se disponível, senão usa a lógica anterior
  let insertIndex =
    dropIndicatorIndex.value !== null ? dropIndicatorIndex.value : dropIndex;

  // Remove o item da posição original
  items.splice(draggedIndex.value, 1);

  // Ajusta o índice de inserção se necessário
  if (draggedIndex.value < insertIndex) {
    insertIndex--;
  }

  // Insere na nova posição
  items.splice(insertIndex, 0, draggedItem);

  // Atualiza os índices de ordem
  items.forEach((item, index) => {
    item.order = index + 1;
  });

  // Atualiza selectedIndex para a nova posição se o item arrastado estava selecionado
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

  // Remove listeners globais
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
};

// Touch events - apenas para item selecionado
const onTouchStart = (event: TouchEvent, index: number) => {
  // Se não é o item selecionado, permite comportamento normal (scroll)
  if (selectedIndex.value !== index) {
    return;
  }

  event.preventDefault();
  const touch = event.touches[0];
  touchStartY.value = touch.clientY;

  let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  let touchEndHandler: ((e: TouchEvent) => void) | null = null;

  // Handler temporário para detectar movimento
  touchMoveHandler = (moveEvent: TouchEvent) => {
    const moveTouch = moveEvent.touches[0];
    if (Math.abs(moveTouch.clientY - touchStartY.value) > 10) {
      // Inicia o drag apenas do item selecionado
      draggedIndex.value = index;
      isTouchDragging.value = true;

      // Remove handlers temporários
      document.removeEventListener("touchmove", touchMoveHandler!);
      document.removeEventListener("touchend", touchEndHandler!);

      // Adiciona handlers definitivos
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd, { once: true });
    }
  };

  touchEndHandler = () => {
    // Remove handlers se não houve drag
    document.removeEventListener("touchmove", touchMoveHandler!);
    document.removeEventListener("touchend", touchEndHandler!);
  };

  // Adiciona handlers temporários
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

      // Calcula posição do indicador
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

      // Remove o item da posição original
      items.splice(draggedIndex.value, 1);

      // Ajusta o índice de inserção se necessário
      if (draggedIndex.value < insertIndex) {
        insertIndex--;
      }

      // Insere na nova posição
      items.splice(insertIndex, 0, draggedItem);

      // Atualiza os índices de ordem
      items.forEach((item, index) => {
        item.order = index + 1;
      });

      // Atualiza selectedIndex para a nova posição se o item arrastado estava selecionado
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
  // Evita dupla seleção em dispositivos touch
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

  // Atualiza os índices de ordem
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

  // Atualiza os índices de ordem
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
</script>

<template>
  <div class="flex gap-4">
    <!-- Botões de controle -->
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
        @click="emit('save:modelValue', modelValue)"
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
        @click="emit('delete:selected', modelValue[selectedIndex ?? 0])"
        :disabled="selectedIndex === null"
      />
    </div>

    <!-- Lista -->
    <div class="flex-1 border border-gray-300 rounded-md overflow-hidden">
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
      <div class="max-h-80 overflow-y-auto relative">
        <div
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

      <div v-if="!modelValue.length" class="p-8 text-center text-gray-500">
        Nenhum ciclo cronológico encontrado
      </div>

      <!-- Instrução para dispositivos touch -->
      <div
        v-if="modelValue.length"
        class="p-2 text-xs text-gray-400 text-center md:hidden"
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
