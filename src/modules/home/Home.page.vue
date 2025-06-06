<script setup lang="ts">
import Card from "primevue/card";
import { useDashboard } from "./hooks/dashboard.hook";

const { dashboardData } = useDashboard();
</script>
<template>
  <section class="grid grid-cols-3 m-6 gap-4 w-full h-fit">
    <Card class="!bg-primary-100">
      <template #title>
        <h2 class="text-lg font-semibold">Clientes cadastrados:</h2>
      </template>
      <template #content>
        <p class="text-4xl font-bold">{{ dashboardData?.customers }}</p>
      </template>
    </Card>
  </section>
</template>
