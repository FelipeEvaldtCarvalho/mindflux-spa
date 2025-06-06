<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import { useUser } from "../hooks/user.hook";
import { useMain } from "../hooks/main.hook";
import { useRouter } from "vue-router";
const router = useRouter();

const { user } = useUser();
const { logout } = useMain();

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
    ],
  },
]);
</script>
<template>
  <div class="h-full p-4">
    <Menu
      :model="items"
      class="!h-full !flex !flex-col !bg-surface-50"
      pt:list="flex-1"
    >
      <template #start>
        <div class="flex items-center justify-center gap-2 py-4">
          <span class="material-symbols-outlined !text-5xl text-primary-900">
            network_intel_node
          </span>
          <span class="text-xl font-bold text-primary-900"> MindFlux </span>
        </div>
      </template>
      <template #item="{ item, props }">
        <a
          class="flex items-center font-semibold"
          v-bind="props.action"
          @click="router.push(item.to)"
        >
          <i class="material-icons">{{ item.icon }}</i>
          <span>{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div class="flex flex-col p-2 gap-2">
          <div
            class="w-full flex items-center gap-2 p-2 hover:bg-primary-100 rounded-lg cursor-pointer transition-all duration-100"
          >
            <Avatar icon="pi pi-user" size="large" shape="circle" />
            <div>
              <p class="font-semibold">{{ user?.name || "Meu Perfil" }}</p>
              <p>{{ user?.email }}</p>
            </div>
          </div>
          <Button label="Sair" icon="pi pi-sign-out" text @click="logout" />
        </div>
      </template>
    </Menu>
  </div>
</template>
