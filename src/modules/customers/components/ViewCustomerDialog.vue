<script lang="ts">
export default {
  name: "ViewCustomerDialog",
};
</script>
<script setup lang="ts">
import Dialog from "primevue/dialog";
import { phoneMask } from "../../../helpers/masks.helper";
import type { Customer } from "../services/customers.types";

defineProps<{
  visible: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(value) => emit('update:visible', value)"
    modal
    header="Dados do Cliente"
    :style="{ width: '450px' }"
    dismissableMask
  >
    <div class="flex flex-col gap-4 mb-4" v-if="customer">
      <div class="grid grid-cols-[120px_1fr] gap-2">
        <span class="font-semibold">Nome:</span>
        <span>{{ customer.name }}</span>

        <span class="font-semibold">Telefone:</span>
        <span>{{ phoneMask(customer.phone) }}</span>

        <template v-if="customer.document">
          <span class="font-semibold">Documento:</span>
          <span>{{ customer.document }}</span>
        </template>

        <template v-if="customer.birthdate">
          <span class="font-semibold">Nascimento:</span>
          <span>{{ new Date(customer.birthdate).toLocaleDateString() }}</span>
        </template>

        <template v-if="customer.address">
          <span class="font-semibold">Endereço:</span>
          <span>{{ customer.address }}</span>
        </template>
      </div>
    </div>
  </Dialog>
</template>
