<script setup lang="ts">
import DatePicker from "primevue/datepicker";
import { onMounted } from "vue";
import { useAppointments } from "../hooks/appointments.hook";

const { calendar, getMonthData, getInitialMonthData, containDay } =
  useAppointments();

onMounted(() => {
  getInitialMonthData();
});

const handleMonthChange = (event: { month: number; year: number }) => {
  const month = `${event.month}-${event.year}`;
  getMonthData(month);
};
</script>
<template>
  <DatePicker
    v-model="calendar"
    inline
    @month-change="handleMonthChange"
    pt:day="relative !overflow-visible"
  >
    <template #date="slotProps">
      <p class="text-md" :class="{ 'font-bold': slotProps.date.selectable }">
        {{ slotProps.date.day }}
      </p>
      <template
        v-if="containDay(slotProps.date.day) && slotProps.date.selectable"
      >
        <span
          class="-top-1 -right-1 text-xs absolute bg-orange-500 w-3 h-3 z-10 flex items-center justify-center rounded-full"
        />
      </template>
    </template>
  </DatePicker>
</template>
