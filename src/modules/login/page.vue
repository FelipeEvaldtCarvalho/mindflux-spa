<script setup>
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import axios from "axios";

import { ref } from "vue";

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    const { data } = await axios.post("http://localhost:3000/auth/login", {
      email: email.value,
      password: password.value,
    });
    console.log("Login successful:", data);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <InputText type="text" v-model="email" placeholder="email" />
    <Password v-model="password" :feedback="false" placeholder="password" />
    <Button label="Login" class="mt-4" @click="login" />
  </div>
</template>
