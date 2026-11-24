<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import type { Customer, CustomerPayload } from "../services/customers.types";
import {
  cpfMask,
  dateMask,
  isValidCpf,
  isValidPhone,
  onlyDigits,
  phoneMask,
} from "@/helpers/masks.helper";
import { displayDateToAPI, formatDateToDisplay } from "@/helpers/date.helper";

// Formulário único para cadastrar e editar (antes eram dois componentes duplicados).
const props = defineProps<{
  visible: boolean;
  customer: Customer | null; // null = novo cliente
  saving: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  save: [payload: CustomerPayload];
}>();

const form = reactive({ name: "", phone: "", document: "", birthdate: "", address: "" });
const touched = reactive({ name: false, phone: false, document: false, birthdate: false });

const isNew = computed(() => !props.customer);

watch(
  () => props.visible,
  (open) => {
    if (!open) return;
    const c = props.customer;
    form.name = c?.name ?? "";
    form.phone = phoneMask(c?.phone);
    form.document = cpfMask(c?.document);
    form.birthdate = formatDateToDisplay(c?.birthdate);
    form.address = c?.address ?? "";
    Object.keys(touched).forEach((k) => (touched[k as keyof typeof touched] = false));
  }
);

const errors = computed(() => ({
  name: form.name.trim() ? "" : "Informe o nome",
  phone: isValidPhone(form.phone) ? "" : "Telefone inválido. Ex.: (11) 91234-5678",
  document:
    !form.document || isValidCpf(form.document) ? "" : "CPF inválido",
  birthdate:
    !form.birthdate || displayDateToAPI(form.birthdate) ? "" : "Data inválida. Use dd/mm/aaaa",
}));

const showError = (field: keyof typeof touched) => touched[field] && !!errors.value[field];

const submit = () => {
  Object.keys(touched).forEach((k) => (touched[k as keyof typeof touched] = true));
  if (Object.values(errors.value).some(Boolean)) return;

  emit("save", {
    name: form.name.trim(),
    phone: onlyDigits(form.phone),
    document: form.document || null,
    birthdate: displayDateToAPI(form.birthdate),
    address: form.address.trim() || null,
  });
};
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(v) => emit('update:visible', v)"
    modal
    :header="isNew ? 'Novo cliente' : 'Editar cliente'"
    :style="{ width: 'min(36rem, 94vw)' }"
    :draggable="false"
  >
    <form class="grid gap-5 pt-2" @submit.prevent="submit" novalidate>
      <div class="grid gap-1">
        <label for="c-name" class="font-medium">Nome *</label>
        <InputText
          id="c-name"
          v-model="form.name"
          autocomplete="off"
          autocapitalize="words"
          :invalid="showError('name')"
          @blur="touched.name = true"
          fluid
        />
        <small v-if="showError('name')" class="text-red-600">{{ errors.name }}</small>
      </div>

      <div class="grid sm:grid-cols-2 gap-5">
        <div class="grid gap-1 content-start">
          <label for="c-phone" class="font-medium">Telefone *</label>
          <InputText
            id="c-phone"
            :modelValue="form.phone"
            @update:modelValue="(v) => (form.phone = phoneMask(v))"
            type="tel"
            inputmode="tel"
            autocomplete="off"
            placeholder="(11) 91234-5678"
            :invalid="showError('phone')"
            @blur="touched.phone = true"
            fluid
          />
          <small v-if="showError('phone')" class="text-red-600">{{ errors.phone }}</small>
        </div>

        <div class="grid gap-1 content-start">
          <label for="c-birthdate" class="font-medium">Data de nascimento</label>
          <InputText
            id="c-birthdate"
            :modelValue="form.birthdate"
            @update:modelValue="(v) => (form.birthdate = dateMask(v))"
            inputmode="numeric"
            autocomplete="off"
            placeholder="dd/mm/aaaa"
            :invalid="showError('birthdate')"
            @blur="touched.birthdate = true"
            fluid
          />
          <small v-if="showError('birthdate')" class="text-red-600">
            {{ errors.birthdate }}
          </small>
        </div>
      </div>

      <div class="grid gap-1">
        <label for="c-document" class="font-medium">CPF</label>
        <InputText
          id="c-document"
          :modelValue="form.document"
          @update:modelValue="(v) => (form.document = cpfMask(v))"
          inputmode="numeric"
          autocomplete="off"
          placeholder="000.000.000-00"
          :invalid="showError('document')"
          @blur="touched.document = true"
          fluid
        />
        <small v-if="showError('document')" class="text-red-600">{{ errors.document }}</small>
      </div>

      <div class="grid gap-1">
        <label for="c-address" class="font-medium">Endereço</label>
        <InputText id="c-address" v-model="form.address" autocomplete="off" fluid />
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          outlined
          @click="emit('update:visible', false)"
        />
        <Button type="submit" :label="isNew ? 'Cadastrar' : 'Salvar'" :loading="saving" />
      </div>
    </form>
  </Dialog>
</template>
