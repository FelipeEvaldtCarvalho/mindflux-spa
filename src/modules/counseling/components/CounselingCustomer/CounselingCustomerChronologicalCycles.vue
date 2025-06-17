<script lang="ts">
export default {
  name: "CounselingCustomerChronologicalCycles",
};
</script>
<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import DatePicker from "primevue/datepicker";
import DraggableList from "./DraggableList.vue";
import CycleForm from "./CycleForm.vue";
import { onMounted } from "vue";

import { useChronologicalCycle } from "@/modules/counseling/hooks/chronological-cycle.hook";

const { selectedDate, getData, list, isLoading, isSaving, saveOrder } =
  useChronologicalCycle();

onMounted(getData);
</script>
<template>
  <TabPanel value="1">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <label class="font-bold" for="name"
          >Selecione a data do atendimento:</label
        >
        <DatePicker
          showIcon
          iconDisplay="input"
          class="w-full md:w-[350px]"
          :showButtonBar="false"
          v-model="selectedDate"
          :disabled="isLoading"
        />
      </div>
      <DraggableList
        v-model="list"
        :loading="isLoading"
        :saving="isSaving"
        @save="saveOrder"
      />
      <CycleForm />
    </div>
  </TabPanel>
</template>
