<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useRoute } from "vue-router";
import { useUser } from "../hooks/user.hook";
import { useMain } from "../hooks/main.hook";
import { useBreakpoint } from "@/hooks/mq.hook";

const route = useRoute();
const { isLgAndUp } = useBreakpoint();
const { user, isAdmin } = useUser();
const { logout } = useMain();

// No iPad na horizontal (>= 1024px) o menu fica fixo na lateral;
// na vertical vira uma barra no topo com menu em tela cheia.
const isDesktop = computed(() => isLgAndUp());
const isSidebarExpanded = ref(true);
const isMenuOpen = ref(false);
const isCollapsed = computed(() => isDesktop.value && !isSidebarExpanded.value);

watch(
  () => route.fullPath,
  () => (isMenuOpen.value = false)
);

const items = computed(() => [
  { label: "Início", icon: "dashboard", to: "/" },
  { label: "Clientes", icon: "groups", to: "/customers" },
  { label: "Agendamentos", icon: "calendar_month", to: "/appointments" },
  ...(isAdmin.value
    ? [{ label: "Operadores", icon: "manage_accounts", to: "/operators" }]
    : []),
]);

const isActive = (to: string) =>
  to === "/" ? route.path === "/" : route.path.startsWith(to);
</script>
<template>
  <!-- Barra superior (iPad na vertical) -->
  <header
    v-if="!isDesktop"
    class="sticky top-0 z-30 bg-primary-100 flex px-5 py-3 items-center justify-between text-primary-800"
  >
    <RouterLink to="/" class="flex items-center gap-2 text-xl font-semibold">
      <span class="material-symbols-outlined !text-4xl">network_intel_node</span>
      MindFlux
    </RouterLink>
    <Button
      text
      rounded
      aria-label="Abrir menu"
      @click="isMenuOpen = true"
      class="!text-primary-800"
    >
      <span class="material-symbols-outlined">grid_view</span>
    </Button>
  </header>

  <!-- Menu: lateral fixa (horizontal) ou tela cheia (vertical) -->
  <nav
    v-if="isDesktop || isMenuOpen"
    class="bg-surface-0 flex flex-col z-40"
    :class="
      isDesktop
        ? [
            'sticky top-0 h-dvh border-r border-surface-200 transition-[width] duration-200',
            isCollapsed ? 'w-[84px]' : 'w-[260px]',
          ]
        : 'fixed inset-0'
    "
    aria-label="Menu principal"
  >
    <div
      class="flex items-center justify-between px-5 py-5 text-primary-800 relative"
    >
      <RouterLink to="/" class="flex items-center gap-2 text-xl font-semibold">
        <span class="material-symbols-outlined !text-4xl">network_intel_node</span>
        <span v-if="!isCollapsed">MindFlux</span>
      </RouterLink>
      <Button
        v-if="!isDesktop"
        text
        rounded
        aria-label="Fechar menu"
        @click="isMenuOpen = false"
      >
        <span class="material-symbols-outlined">close</span>
      </Button>
      <button
        v-if="isDesktop"
        type="button"
        class="absolute -right-4 top-7 w-8 h-8 flex items-center justify-center bg-surface-0 border border-surface-200 rounded-full shadow-sm hover:bg-primary-100"
        :aria-label="isSidebarExpanded ? 'Recolher menu' : 'Expandir menu'"
        @click="isSidebarExpanded = !isSidebarExpanded"
      >
        <span
          class="material-symbols-outlined !text-xl transition-transform"
          :class="{ 'rotate-180': isSidebarExpanded }"
          >chevron_right</span
        >
      </button>
    </div>

    <ul class="flex-1 flex flex-col gap-1 px-3">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="flex items-center gap-3 px-4 min-h-[52px] rounded-xl text-lg transition-colors"
          :class="[
            isActive(item.to)
              ? 'bg-primary-100 text-primary-800 font-semibold'
              : 'text-surface-700 hover:bg-surface-100',
            { 'justify-center !px-0': isCollapsed },
          ]"
          :title="isCollapsed ? item.label : undefined"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <div class="grid gap-2 p-3 border-t border-surface-200">
      <div
        class="flex items-center gap-3 p-2"
        :class="{ 'justify-center': isCollapsed }"
      >
        <Avatar icon="pi pi-user" shape="circle" class="shrink-0" />
        <div v-if="!isCollapsed" class="min-w-0">
          <p class="font-semibold truncate">{{ user?.name || "Meu perfil" }}</p>
          <p class="text-sm text-surface-500 truncate">{{ user?.email }}</p>
        </div>
      </div>
      <Button
        :label="isCollapsed ? undefined : 'Sair'"
        icon="pi pi-sign-out"
        text
        severity="secondary"
        aria-label="Sair"
        @click="logout"
        class="!w-full"
      />
    </div>
  </nav>
</template>
