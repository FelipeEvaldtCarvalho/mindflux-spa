<script setup lang="ts">
import DatePicker from "primevue/datepicker";
import { useAppointments } from "../hooks/appointments.hook";

const { calendar, loadMonth, selectDate, daysWithAppointments } = useAppointments();

const pad = (n: number) => String(n).padStart(2, "0");
// slotProps.date.month começa em 0
const hasAppointment = (d: { day: number; month: number; year: number }) =>
  daysWithAppointments.value.has(`${d.year}-${pad(d.month + 1)}-${pad(d.day)}`);

// Atenção: o PrimeVue manda month 1–12 no month-change, mas 0–11 no year-change.
const handleMonthChange = (event: { month: number; year: number }) => {
  loadMonth(event.year, event.month);
};
const handleYearChange = (event: { month: number; year: number }) => {
  loadMonth(event.year, event.month + 1);
};
</script>
<template>
  <DatePicker
    :modelValue="calendar"
    @update:modelValue="(d) => d && selectDate(d as Date)"
    inline
    @month-change="handleMonthChange"
    @year-change="handleYearChange"
    class="w-full"
    pt:panel="!w-full !border-surface-200"
    pt:day="relative !overflow-visible"
  >
    <template #date="slotProps">
      <span>{{ slotProps.date.day }}</span>
      <span
        v-if="hasAppointment(slotProps.date) && slotProps.date.selectable"
        class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"
        aria-hidden="true"
      />
    </template>
  </DatePicker>
</template>
