<script setup lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useLogin } from "./hooks/login.hook";

const { email, password, login, isDisabledButton, isSubmitting } = useLogin();
</script>
<template>
  <form
    class="flex items-center justify-center min-h-dvh w-full p-6"
    @submit.prevent="login"
  >
    <div class="flex flex-col items-center gap-8 w-full max-w-sm">
      <div class="flex flex-col items-center gap-2 text-primary-900">
        <span class="material-symbols-outlined !text-8xl">network_intel_node</span>
        <h1 class="page-title">MindFlux</h1>
        <p class="text-surface-600">Entre com sua conta</p>
      </div>
      <div class="grid gap-4 w-full">
        <div class="grid gap-1">
          <label for="email" class="font-medium">E-mail</label>
          <!-- Sem autocapitalização/correção: o teclado do iPad coloca maiúscula no início -->
          <InputText
            id="email"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="username"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            fluid
          />
        </div>
        <div class="grid gap-1">
          <label for="password" class="font-medium">Senha</label>
          <Password
            inputId="password"
            v-model="password"
            :feedback="false"
            :inputProps="{ autocomplete: 'current-password' }"
            fluid
            toggleMask
          />
        </div>
      </div>
      <div class="grid gap-3 w-full text-center">
        <Button
          label="Entrar"
          type="submit"
          fluid
          size="large"
          :loading="isSubmitting"
          :disabled="isDisabledButton"
        />
        <p class="text-sm text-surface-500">
          Esqueceu a senha? Fale com o administrador do sistema.
        </p>
      </div>
    </div>
  </form>
</template>
