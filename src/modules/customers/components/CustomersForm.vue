<script setup lang="ts">
import TabPanel from "primevue/tabpanel";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";

const { push } = useRouter();

// schema de validação com Zod
const schema = toTypedSchema(
  z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    document: z.string().min(11, "Documento inválido"),
    birthdate: z.string().min(1, "Data de nascimento obrigatória"),
    address: z.string().min(1, "Endereço obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
  })
);

const { handleSubmit, meta } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError } = useField("name");
const { value: document, errorMessage: documentError } = useField("document");
const { value: birthdate, errorMessage: birthdateError } =
  useField("birthdate");
const { value: address, errorMessage: addressError } = useField("address");
const { value: phone, errorMessage: phoneError } = useField("phone");

const createUser = handleSubmit((values) => {
  console.log("Form:", values);
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
              <InputText
                v-model="document"
                id="document"
                autocomplete="off"
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
              <InputText
                v-model="birthdate"
                id="birthdate"
                autocomplete="off"
                :invalid="!!birthdateError"
                fluid
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
              <InputText
                v-model="phone"
                id="phone"
                autocomplete="off"
                :invalid="!!phoneError"
                fluid
              />
              <label for="phone">Telefone</label>
            </FloatLabel>
            <div class="text-red-500 text-sm text-left">{{ phoneError }}</div>
          </div>

          <Button
            label="Cadastrar"
            fluid
            type="submit"
            :disabled="!meta.valid"
          />
        </div>
      </div>
    </form>
  </TabPanel>
</template>
