<script setup lang="ts">
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { connectionState } from "@/services/api.service";
</script>
<template>
  <Toast position="top-center" />
  <!-- Diálogo de confirmação único para o app todo (melhor que popups no toque) -->
  <ConfirmDialog :style="{ width: 'min(28rem, 92vw)' }" />

  <Transition name="fade">
    <div
      v-if="connectionState.slowRequests > 0"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1200] flex items-center gap-3 bg-surface-900 text-white px-5 py-3 rounded-full shadow-lg"
      role="status"
    >
      <span class="material-symbols-outlined animate-pulse">cloud_sync</span>
      <span>Conectando ao servidor… pode levar até 1 minuto.</span>
    </div>
  </Transition>

  <RouterView />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
