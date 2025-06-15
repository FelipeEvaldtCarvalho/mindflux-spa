<script lang="ts">
export default {
  name: "CounselingCustomerInitialInterview",
};
</script>
<script setup lang="ts">
import Textarea from "primevue/textarea";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";
import { useCounseling } from "@/modules/counseling/hooks/counseling.hook";

const {
  dailyLife,
  expectations,
  hasHadTherapy,
  reason,
  symptomsTime,
  loading,
  updateData,
} = useCounseling();
</script>
<template>
  <TabPanel value="0">
    <form class="grid gap-4">
      <Button
        :label="loading ? 'Salvando...' : 'Salvar'"
        :icon="loading ? 'pi pi-spin pi-spinner' : ''"
        :loading="loading"
        :disabled="loading"
        class="ml-auto"
        @click="updateData"
      />
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold" for="description"
          >O que te trouxe para a terapia nesse momento?</label
        >
        <Textarea rows="2" v-model="reason" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold" for="description"
          >Há quanto tempo você vem se sentindo assim?</label
        >
        <Textarea rows="2" v-model="symptomsTime" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold" for="description"
          >Como isso está afetando sua vida no dia a dia?</label
        >
        <Textarea rows="2" v-model="dailyLife" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold" for="description"
          >Você já fez terapia antes? Como foi sua experiência?</label
        >
        <Textarea rows="2" v-model="hasHadTherapy" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold" for="description"
          >O que voce espera alcancar com a terapia?</label
        >
        <Textarea rows="2" v-model="expectations" :disabled="loading" />
      </div>
    </form>
  </TabPanel>
</template>
