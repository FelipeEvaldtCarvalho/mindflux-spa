<script setup lang="ts">
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import InputMask from "primevue/inputmask";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import type { Customer, CreateCustomer } from "../services/customers.types";
import { watch } from "vue";

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

const { handleSubmit, setValues, values, errors } = useForm({
  validationSchema: schema,
});

const handleEdit = handleSubmit(async (values) => {
  if (props.customer && values.name && values.phone) {
    const payload = {
      name: values.name,
      phone: values.phone,
      document: values.document,
      address: values.address,
      birthdate: values.birthdate
        ? values.birthdate.toISOString().split("T")[0]
        : undefined,
    };
    emit("save", props.customer.id, payload);
  }
});

watch(
  () => props.customer,
  (newCustomer: Customer | null) => {
    if (newCustomer) {
      setValues({
        name: newCustomer.name,
        document: newCustomer.document || "",
        birthdate: newCustomer.birthdate
          ? new Date(newCustomer.birthdate)
          : undefined,
        address: newCustomer.address || "",
        phone: newCustomer.phone,
      });
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
              v-model="values.name"
              id="name"
              autocomplete="off"
              :invalid="!!errors.name"
              fluid
            />
            <label for="name">Nome</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ errors.name }}</div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputMask
              id="document"
              v-model="values.document"
              mask="999.999.99-99"
              :invalid="!!errors.document"
              fluid
            />
            <label for="document">Documento</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">
            {{ errors.document }}
          </div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <DatePicker
              id="birthdate"
              v-model="values.birthdate"
              showIcon
              fluid
              iconDisplay="input"
              :invalid="!!errors.birthdate"
            />
            <label for="birthdate">Data de nascimento</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">
            {{ errors.birthdate }}
          </div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputText
              v-model="values.address"
              id="address"
              autocomplete="off"
              :invalid="!!errors.address"
              fluid
            />
            <label for="address">Endereço</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ errors.address }}</div>
        </div>

        <div class="grid gap-2 w-full mt-8">
          <FloatLabel>
            <InputMask
              id="phone"
              v-model="values.phone"
              mask="(99) 999.999.999"
              :invalid="!!errors.phone"
              fluid
              unmask
              :autoClear="false"
            />
            <label for="phone">Telefone</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ errors.phone }}</div>
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
