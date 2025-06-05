<script setup lang="ts">
import { useUser } from "@/modules/main/hooks/user.hook";

const { user } = useUser();
</script>
<template>
  <h1>HOME PAGE</h1>
  <pre>
    {{ user }}
  </pre>
</template>
