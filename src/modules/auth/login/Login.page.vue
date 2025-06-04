<script setup>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useLogin } from "./hooks/login.hook";

const { email, password, login, isDisabledButton } = useLogin();
</script>
<template>
  <form
    class="flex items-center justify-center min-h-screen w-full"
    @submit.prevent="login"
  >
    <div class="flex flex-col items-center justify-center gap-8 w-80">
      <span class="material-symbols-outlined !text-8xl text-primary-900">
        network_intel_node
      </span>
      <p class="text-lg text-primary-900 font-semibold">Entrar</p>
      <div class="grid gap-4 w-full text-center">
        <InputText type="text" v-model="email" placeholder="Email" fluid />
        <Password
          v-model="password"
          :feedback="false"
          placeholder="Senha"
          fluid
          class="w-full"
          toggleMask
        />
      </div>
      <div class="grid gap-2 w-full text-center">
        <Button
          label="Login"
          type="submit"
          fluid
          :disabled="isDisabledButton"
        />
        <a href="#" class="text-surface-500 text-xs text-center">
          Esqueceu sua senha?
        </a>
      </div>
      <div class="grid gap-2 w-full text-center">
        <p class="text-sm">Não tem uma conta?</p>
        <Button label="Criar uma conta" type="submit" fluid size="small" text />
      </div>
    </div>
  </form>
</template>
