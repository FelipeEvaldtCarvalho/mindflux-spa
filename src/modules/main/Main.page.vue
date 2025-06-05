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
  <section class="flex w-full h-screen">
    <SideMenu />
    <RouterView />
  </section>
</template>
