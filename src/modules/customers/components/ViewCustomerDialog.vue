<script lang="ts">
export default {
  name: "ViewCustomerDialog",
};
</script>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { phoneMask } from "@/helpers/masks.helper";
import { formatDateToDisplay } from "@/helpers/date.helper";
import type { Customer } from "../services/customers.types";

defineProps<{
  visible: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
  open: [customer: Customer];
  edit: [customer: Customer];
  remove: [customer: Customer];
}>();
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(value) => emit('update:visible', value)"
    modal
    :header="customer?.name ?? 'Cliente'"
    :style="{ width: 'min(32rem, 94vw)' }"
    :draggable="false"
    dismissableMask
  >
    <dl v-if="customer" class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 mb-6">
      <dt class="font-semibold text-surface-600">Telefone</dt>
      <dd>
        <a :href="`tel:${customer.phone}`" class="text-primary-700 underline">
          {{ phoneMask(customer.phone) }}
        </a>
      </dd>

      <template v-if="customer.document">
        <dt class="font-semibold text-surface-600">CPF</dt>
        <dd>{{ customer.document }}</dd>
      </template>

      <template v-if="customer.birthdate">
        <dt class="font-semibold text-surface-600">Nascimento</dt>
        <dd>{{ formatDateToDisplay(customer.birthdate) }}</dd>
      </template>

      <template v-if="customer.address">
        <dt class="font-semibold text-surface-600">Endereço</dt>
        <dd>{{ customer.address }}</dd>
      </template>
    </dl>

    <div v-if="customer" class="flex flex-wrap justify-between gap-2">
      <Button
        label="Excluir"
        icon="pi pi-trash"
        severity="danger"
        text
        @click="emit('remove', customer)"
      />
      <div class="flex gap-2">
        <Button
          label="Editar"
          icon="pi pi-pencil"
          severity="secondary"
          outlined
          @click="emit('edit', customer)"
        />
        <Button label="Atendimento" icon="pi pi-arrow-right" iconPos="right" @click="emit('open', customer)" />
      </div>
    </div>
  </Dialog>
</template>
