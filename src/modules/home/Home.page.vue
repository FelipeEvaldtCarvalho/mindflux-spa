<script setup lang="ts">
import Card from "primevue/card";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import { useDashboard } from "./hooks/dashboard.hook";

const { dashboardData, isLoading, hasError, getData } = useDashboard();
</script>
<template>
  <section class="grid md:grid-cols-2 lg:grid-cols-3 m-6 gap-4 h-fit">
    <Card class="!bg-primary-100">
      <template #title>
        <h2 class="text-lg font-semibold">Clientes cadastrados:</h2>
      </template>
      <template #content>
        <Button
          v-if="hasError"
          label="Tentar novamente"
          @click="getData"
          icon="pi pi-refresh"
          size="small"
          class="h-[40px]"
        />
        <Skeleton v-else-if="isLoading" width="100px" height="40px" />
        <p v-else class="text-4xl font-bold">{{ dashboardData?.customers }}</p>
      </template>
    </Card>
  </section>
</template>
