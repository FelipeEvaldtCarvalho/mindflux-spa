<script setup lang="ts">
import Calendar from "./components/Calendar.vue";
import AddForm from "./components/AddForm.vue";
import List from "./components/List.vue";
</script>
<template>
  <section class="grid m-6 gap-4 h-fit">
    <h1 class="text-xl font-bold text-primary-900">Agendamentos:</h1>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      <Calendar />
      <AddForm />
      <List />
    </div>
  </section>
</template>
