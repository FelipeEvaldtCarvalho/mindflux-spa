<script setup lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import { useRouter } from "vue-router";
import { useCreate } from "./hooks/create.hook";
import { z } from "zod";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

const { push } = useRouter();
const { create } = useCreate();

const schema = toTypedSchema(
  z
    .object({
      name: z.string().min(1, "Nome é obrigatório"),
      email: z.string().email("Email inválido"),
      password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
      passwordConfirmation: z.string().min(6, "Confirmação obrigatória"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "As senhas não coincidem",
      path: ["passwordConfirmation"],
    })
);

const { handleSubmit, meta } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } =
  useField<string>("passwordConfirmation");

const createUser = handleSubmit((values) => {
  const payload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  console.log("Formulário válido", payload);
  create(payload);
});
</script>
<template>
  <form
    class="flex items-center justify-center min-h-screen w-full"
    @submit.prevent="createUser"
  >
    <div class="flex flex-col items-center justify-center gap-8 w-80">
      <p class="text-lg text-primary-900 font-semibold">Cadastrar:</p>
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
              v-model="email"
              id="email"
              type="email"
              autocomplete="off"
              fluid
              :invalid="!!emailError"
            />
            <label for="email">Email</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ emailError }}</div>
        </div>
        <div class="grid gap-2 w-full">
          <FloatLabel>
            <Password
              v-model="password"
              id="password"
              :feedback="false"
              toggleMask
              fluid
              autocomplete="new-password"
              :invalid="!!passwordError"
            />
            <label for="password">Senha</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">{{ passwordError }}</div>
        </div>
        <div class="grid gap-2 w-full">
          <FloatLabel>
            <Password
              v-model="passwordConfirmation"
              id="password-confirm"
              :feedback="false"
              toggleMask
              fluid
              autocomplete="new-password"
              :invalid="!!passwordConfirmationError"
            />
            <label for="password-confirm">Confirme sua senha</label>
          </FloatLabel>
          <div class="text-red-500 text-sm text-left">
            {{ passwordConfirmationError }}
          </div>
        </div>

        <Button label="Cadastrar" fluid type="submit" :disabled="!meta.valid" />
      </div>
      <div class="grid gap-2 w-full text-center">
        <p class="text-sm">Já tenho uma conta!</p>
        <Button
          label="Fazer login"
          fluid
          size="small"
          text
          @click="push({ name: 'auth.login' })"
        />
      </div>
    </div>
  </form>
</template>
