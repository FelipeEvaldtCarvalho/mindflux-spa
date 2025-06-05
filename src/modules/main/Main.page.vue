<script setup lang="ts">
import { useUser } from "@/modules/main/hooks/user.hook";
import { onMounted } from "vue";

const { getUser } = useUser();

onMounted(async () => {
  await getUser();
});
</script>
<template>
  <RouterView />
</template>
