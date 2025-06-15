<script setup lang="ts">
import { ref, computed } from "vue";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useUser } from "../hooks/user.hook";
import { useMain } from "../hooks/main.hook";
import { useRouter } from "vue-router";
import { useBreakpoint } from "@/hooks/mq.hook";

const router = useRouter();
const { isLgAndUp } = useBreakpoint();

const { user } = useUser();
const { logout } = useMain();

const isSidebarExpanded = ref(true);

const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value;
};

const isMenuOpen = ref(false);

const showMenu = computed(() => {
  return isLgAndUp() || isMenuOpen.value;
});

const isMinimizedSidebar = computed(() => {
  return !isSidebarExpanded.value && isLgAndUp();
});

const handleItemClick = (item: any) => {
  if (item.to) {
    router.push(item.to);
    isMenuOpen.value = false;
  }
};

const items = ref([
  {
    items: [
      {
        label: "Dashboard",
        icon: "dashboard",
        to: "/",
      },
      {
        label: "Clientes",
        icon: "groups",
        to: "/customers",
      },
      {
        label: "Atendimentos",
        icon: "psychology",
        to: "/counseling",
      },
    ],
  },
]);
</script>
<template>
  <div
    id="side-menu"
    class="sticky top-0 left-0 z-10 lg:h-screen lg:p-2"
    :class="{
      'lg:w-fit lg:min-w-fit': isMinimizedSidebar,
      'lg:w-[260px] lg:min-w-[260px]': !isMinimizedSidebar,
    }"
  >
    <div
      class="bg-primary-100 flex p-6 w-full justify-between items-center text-primary-800 text-xl font-semibold lg:hidden !overflow-hidden"
      v-if="!isLgAndUp()"
    >
      <div class="flex items-center gap-2 cursor-pointer">
        <span class="material-symbols-outlined !text-4xl">
          network_intel_node
        </span>
        MindFlux
      </div>
      <i class="material-icons cursor-pointer" @click="isMenuOpen = !isMenuOpen"
        >grid_view</i
      >
    </div>
    <Menu
      appendTo="#side-menu"
      v-if="showMenu"
      :model="items"
      class="absolute w-full h-screen top-0 left-0 z-20 flex flex-col lg:static lg:!h-[-webkit-fill-available]"
      :class="{
        '!min-w-fit': !isSidebarExpanded,
        '': isSidebarExpanded,
      }"
      pt:list="flex-1 !p-4"
      pt:submenulabel="hidden"
      pt:start="flex p-6 w-full justify-between items-center text-primary-800 text-xl font-semibold relative"
      pt:end="grid p-6 w-full !p-4 gap-2"
    >
      <template #start>
        <div class="flex items-center gap-2 cursor-pointer">
          <span class="material-symbols-outlined !text-4xl">
            network_intel_node
          </span>
          <span v-if="!isMinimizedSidebar" class=""> MindFlux </span>
        </div>
        <i
          class="material-icons cursor-pointer lg:!hidden"
          @click="isMenuOpen = false"
          >close</i
        >
        <div
          class="hidden lg:!flex items-center justify-center absolute bg-surface-200 hover:!bg-primary-300 p-px rounded-full aspect-square -right-3 -bottom-3 cursor-pointer"
          @click="toggleSidebar"
        >
          <i
            class="material-icons"
            :class="{
              'rotate-180': isSidebarExpanded,
            }"
            >chevron_right</i
          >
        </div>
      </template>
      <template #item="{ item, props }">
        <a
          class="flex items-center gap-2"
          :class="{
            'justify-center': !isSidebarExpanded,
            '': isSidebarExpanded,
          }"
          v-bind="props.action"
          @click="handleItemClick(item)"
        >
          <i class="material-icons">{{ item.icon }}</i>
          <span v-if="!isMinimizedSidebar">{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div
          class="hover:bg-primary-50 rounded-lg cursor-pointer overflow-hidden p-3"
        >
          <div class="flex lg:flex-col w-full gap-4 lg:gap-2">
            <Avatar icon="pi pi-user" shape="circle" class="m-auto" />
            <div class="flex flex-col w-full gap-1">
              <p
                class="overflow-hidden text-lg font-semibold text text-nowrap !text-ellipsis"
                v-if="!isMinimizedSidebar"
              >
                {{ user?.name || "Meu Perfil" }}
              </p>
              <p
                class="overflow-hidden text-nowrap text-ellipsis"
                v-if="!isMinimizedSidebar"
              >
                {{ user?.email }}
              </p>
            </div>
          </div>
        </div>
        <Button
          :label="isSidebarExpanded ? 'Sair' : ''"
          icon="pi pi-sign-out"
          text
          @click="logout"
          class="!w-full"
        />
      </template>
    </Menu>
  </div>
</template>
