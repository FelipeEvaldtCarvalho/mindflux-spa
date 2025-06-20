<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import InputMask from "primevue/inputmask";
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import type { Customer, CreateCustomer } from "../services/customers.types";
import { watch } from "vue";
import { formatDateToAPI } from "../../../helpers/date.helper";

const props = defineProps<{
  visible: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "save", id: string, data: CreateCustomer): void;
}>();

const schema = toTypedSchema(
  z.object({
    name: z.string({ required_error: "Campo obrigatório" }),
    document: z.string().optional(),
    birthdate: z.date().optional(),
    address: z.string().optional(),
    phone: z
      .string({ required_error: "Campo obrigatório" })
      .min(10, "Telefone inválido"),
  })
);

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: document, errorMessage: documentError } =
  useField<string>("document");
const { value: birthdate, errorMessage: birthdateError } = useField<
  Date | undefined
>("birthdate");
const { value: address, errorMessage: addressError } =
  useField<string>("address");
const { value: phone, errorMessage: phoneError } = useField<string>("phone");

const handleEdit = handleSubmit(async (values) => {
  if (props.customer && values.name && values.phone) {
    const payload = {
      name: values.name,
      phone: values.phone,
      document: values.document,
      address: values.address,
      birthdate: values.birthdate
        ? formatDateToAPI(values.birthdate)
        : undefined,
    };
    emit("save", props.customer.id, payload);
  }
});

watch(
  () => props.customer,
  (newCustomer: Customer | null) => {
    if (newCustomer) {
      name.value = newCustomer.name;
      document.value = newCustomer.document || "";
      birthdate.value = newCustomer.birthdate
        ? new Date(newCustomer.birthdate)
        : undefined;
      address.value = newCustomer.address || "";
      phone.value = newCustomer.phone;
    }
  },
  { immediate: true }
);
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="(value) => emit('update:visible', value)"
    modal
    header="Editar Cliente"
    :style="{ width: '450px' }"
  >
    <div class="flex flex-col gap-4">
      <form @submit.prevent="handleEdit">
        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputText
              v-model="name"
              id="name"
              autocomplete="off"
              :invalid="!!nameError"
              fluid
            />
            <label for="name">Nome</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ nameError }}</div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputMask
              id="document"
              v-model="document"
              mask="999.999.99-99"
              :invalid="!!documentError"
              fluid
            />
            <label for="document">Documento</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">
            {{ documentError }}
          </div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <DatePicker
              id="birthdate"
              v-model="birthdate"
              showIcon
              fluid
              iconDisplay="input"
              :invalid="!!birthdateError"
            />
            <label for="birthdate">Data de nascimento</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">
            {{ birthdateError }}
          </div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputText
              v-model="address"
              id="address"
              autocomplete="off"
              :invalid="!!addressError"
              fluid
            />
            <label for="address">Endereço</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ addressError }}</div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputMask
              id="phone"
              v-model="phone"
              mask="(99) 999.999.999"
              :invalid="!!phoneError"
              fluid
              unmask
              :autoClear="false"
            />
            <label for="phone">Telefone</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ phoneError }}</div>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            outlined
            @click="emit('update:visible', false)"
            class="mr-2"
            type="button"
          />
          <Button label="Salvar" icon="pi pi-check" type="submit" autofocus />
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script lang="ts">
export default {
  name: "EditCustomerDialog",
};
</script>
