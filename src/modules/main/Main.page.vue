<script setup lang="ts">
import { useUser } from "@/modules/main/hooks/user.hook";
import { onMounted } from "vue";
import SideMenu from "./components/SideMenu.vue";

const { loadUser } = useUser();

onMounted(loadUser);
</script>
<template>
  <div class="flex flex-col lg:flex-row min-h-dvh">
    <SideMenu />
    <main class="max-w-full flex-1 min-w-0">
      <RouterView />
    </main>
  </div>
</template>
