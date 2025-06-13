<script setup lang="ts">
import { useUser } from "@/modules/main/hooks/user.hook";
import { onMounted } from "vue";
import SideMenu from "./components/SideMenu.vue";

const { getUser } = useUser();

onMounted(async () => {
  await getUser();
});
</script>
<template>
  <div class="flex flex-col lg:flex-row min-h-dvh">
    <SideMenu />
    <div class="max-w-full flex-1 overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
