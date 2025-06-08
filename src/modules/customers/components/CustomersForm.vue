<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import FloatLabel from "primevue/floatlabel";
import InputMask from "primevue/inputmask";
import { useCustomers } from "../hooks/customers.hook";

const { createCustomer } = useCustomers();

const schema = toTypedSchema(
  z.object({
    name: z.string().nonempty("Campo obrigatório"),
    document: z.string().optional(),
    birthdate: z.date().optional(),
    address: z.string().optional(),
    phone: z.string().min(10, "Telefone inválido"),
  })
);

const { handleSubmit, resetForm, meta } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError } = useField("name");
const { value: document, errorMessage: documentError } = useField("document");
const { value: birthdate, errorMessage: birthdateError } =
  useField("birthdate");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const createUser = handleSubmit(async (values) => {
  const payload = {
    ...values,
    birthdate: values.birthdate
      ? values.birthdate.toISOString().split("T")[0]
      : undefined,
  };

  await createCustomer(payload);
  resetForm({ values: undefined });
});
</script>

<template>
  <TabPanel value="1">
    <form class="flex items-center justify-center" @submit.prevent="createUser">
      <div class="flex flex-col items-center justify-center gap-8 w-80">
        <p class="text-lg text-primary-900 font-semibold">
          Cadastrar novo cliente:
        </p>
        <div class="grid gap-8 w-full text-center">
          <div class="grid gap-2 w-full">
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
          <div class="grid gap-2 w-full">
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
          <div class="grid gap-2 w-full">
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
          <div class="grid gap-2 w-full">
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
          <div class="grid gap-2 w-full">
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
          <Button label="Cadastrar" fluid type="submit" />
        </div>
      </div>
    </form>
  </TabPanel>
</template>
