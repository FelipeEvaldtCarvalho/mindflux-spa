<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "primevue/card";
import Skeleton from "primevue/skeleton";
import Button from "primevue/button";
import { useDashboard } from "./hooks/dashboard.hook";
import { useUser } from "@/modules/main/hooks/user.hook";
import { formatLongDate } from "@/helpers/date.helper";

const { dashboardData, todayAppointments, isLoading, hasError, getData } = useDashboard();
const { user } = useUser();

const greeting = computed(() => {
  const hour = new Date().getHours();
  const period = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user.value?.name?.split(" ")[0];
  return firstName ? `${period}, ${firstName}` : period;
});

onMounted(getData);
</script>
<template>
  <section class="grid gap-6 p-6 lg:p-8">
    <header>
      <h1 class="page-title">{{ greeting }}</h1>
      <p class="text-surface-600 capitalize">{{ formatLongDate(new Date()) }}</p>
    </header>

    <div v-if="hasError" class="flex items-center gap-4 p-4 rounded-xl bg-red-50 text-red-800">
      <span class="flex-1">Não foi possível carregar o resumo.</span>
      <Button label="Tentar novamente" icon="pi pi-refresh" size="small" @click="getData" />
    </div>

    <div class="grid md:grid-cols-[1fr_2fr] gap-6 items-start">
      <Card class="!bg-primary-100 !shadow-none">
        <template #content>
          <p class="text-primary-900 font-medium">Clientes cadastrados</p>
          <Skeleton v-if="isLoading" width="80px" height="48px" class="mt-2" />
          <p v-else class="text-5xl font-bold text-primary-900 mt-1">
            {{ dashboardData?.customers ?? "–" }}
          </p>
          <RouterLink to="/customers" class="inline-block mt-3 text-primary-700 font-medium">
            Ver clientes →
          </RouterLink>
        </template>
      </Card>

      <Card class="!shadow-none border border-surface-200">
        <template #content>
          <div class="flex items-center justify-between gap-4 mb-3">
            <h2 class="section-title">Agenda de hoje</h2>
            <RouterLink to="/appointments" class="text-primary-700 font-medium">
              Abrir agenda →
            </RouterLink>
          </div>
          <div v-if="isLoading" class="grid gap-2">
            <Skeleton v-for="n in 3" :key="n" height="48px" />
          </div>
          <ul v-else-if="todayAppointments.length" class="grid gap-1">
            <li v-for="a in todayAppointments" :key="a.id">
              <RouterLink
                :to="{ name: 'counseling.customer', params: { id: a.customer.id } }"
                class="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-surface-100"
              >
                <span class="font-semibold tabular-nums text-primary-800">{{ a.time }}</span>
                <span class="flex-1 font-medium">{{ a.customer.name }}</span>
                <i class="pi pi-angle-right text-surface-400" />
              </RouterLink>
            </li>
          </ul>
          <p v-else class="text-surface-500 py-4">Nenhum atendimento agendado para hoje.</p>
        </template>
      </Card>
    </div>
  </section>
</template>
