<script lang="ts">
export default {
  name: "CounselingCustomerInitialInterview",
};
</script>
<script setup lang="ts">
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import { useCounseling } from "@/modules/counseling/hooks/counseling.hook";

const {
  dailyLife,
  expectations,
  hasHadTherapy,
  reason,
  symptomsTime,
  loading,
  saving,
  isDirty,
  save,
} = useCounseling();

const questions = [
  { id: "reason", label: "O que te trouxe para a terapia nesse momento?", model: reason },
  { id: "symptomsTime", label: "Há quanto tempo você vem se sentindo assim?", model: symptomsTime },
  { id: "dailyLife", label: "Como isso está afetando sua vida no dia a dia?", model: dailyLife },
  { id: "hasHadTherapy", label: "Você já fez terapia antes? Como foi sua experiência?", model: hasHadTherapy },
  { id: "expectations", label: "O que você espera alcançar com a terapia?", model: expectations },
];
</script>
<template>
  <form class="grid gap-6 max-w-3xl" @submit.prevent="save">
    <div v-for="q in questions" :key="q.id" class="grid gap-2">
      <label :for="q.id" class="font-semibold">{{ q.label }}</label>
      <Textarea
        :id="q.id"
        v-model="q.model.value"
        rows="3"
        autoResize
        :disabled="loading"
        fluid
      />
    </div>

    <!-- Barra de salvar fixa no rodapé: sempre ao alcance enquanto se escreve -->
    <div
      class="sticky bottom-0 -mx-6 lg:-mx-8 px-6 lg:px-8 py-3 bg-surface-0/95 backdrop-blur border-t border-surface-200 flex items-center justify-end gap-4"
    >
      <span v-if="isDirty" class="text-surface-600">Alterações não salvas</span>
      <span v-else-if="!loading" class="text-surface-500">
        <i class="pi pi-check text-green-600" /> Salvo
      </span>
      <Button
        type="submit"
        label="Salvar entrevista"
        icon="pi pi-save"
        :loading="saving"
        :disabled="loading || !isDirty"
      />
    </div>
  </form>
</template>
