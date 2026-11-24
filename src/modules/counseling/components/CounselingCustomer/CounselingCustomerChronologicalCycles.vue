<script lang="ts">
export default {
  name: "CounselingCustomerChronologicalCycles",
};
</script>
<script setup lang="ts">
import DatePicker from "primevue/datepicker";
import DraggableList from "./DraggableList.vue";
import CycleForm from "./CycleForm.vue";
import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const { selectedDate, list, isLoading, isSaving, isSavingOrder, reorder, deleteCycle, updateCycle } =
  useChronologicalCycle();

const today = new Date();
</script>
<template>
  <div class="grid gap-6">
    <div class="grid gap-2 w-full sm:w-80">
      <label class="font-semibold" for="cycle-date">Data do atendimento</label>
      <DatePicker
        inputId="cycle-date"
        v-model="selectedDate"
        showIcon
        iconDisplay="input"
        :manualInput="false"
        :maxDate="today"
        :disabled="isLoading"
        dateFormat="dd/mm/yy"
        fluid
      />
    </div>

    <DraggableList
      :modelValue="list"
      :loading="isLoading"
      :saving="isSaving"
      :savingOrder="isSavingOrder"
      @update:modelValue="reorder"
      @delete="deleteCycle"
      @edit="updateCycle"
    />

    <CycleForm />
  </div>
</template>
