<script setup lang="ts">
import { onMounted } from "vue";
import Calendar from "./components/Calendar.vue";
import AddForm from "./components/AddForm.vue";
import List from "./components/List.vue";
import { useAppointments } from "./hooks/appointments.hook";
import { useCustomers } from "@/modules/customers/hooks/customers.hook";
import { formatLongDate } from "@/helpers/date.helper";

const { calendar, loadMonth } = useAppointments();
const { getData: loadCustomers } = useCustomers();

onMounted(() => {
  loadMonth();
  loadCustomers();
});
</script>
<template>
  <section class="grid gap-6 p-6 lg:p-8">
    <h1 class="page-title">Agendamentos</h1>
    <div class="grid md:grid-cols-[minmax(0,22rem)_1fr] gap-8 items-start">
      <Calendar />
      <div class="grid gap-6">
        <h2 class="section-title capitalize">{{ formatLongDate(calendar) }}</h2>
        <List />
        <AddForm />
      </div>
    </div>
  </section>
</template>
