<script lang="ts">
export default {
  name: "FeedBack",
};
</script>
<script setup lang="ts">
defineProps<{
  title?: string;
  icon?: string;
  description?: string;
}>();
</script>

<template>
  <div class="p-6 flex flex-col items-center gap-2">
    <div
      v-if="icon"
      class="bg-primary-200 rounded-full p-4 aspect-square flex items-center justify-center"
    >
      <span class="material-symbols-outlined !text-5xl text-white">
        {{ icon }}
      </span>
    </div>
    <p v-if="title" class="text-xlg font-semibold">
      {{ title }}
    </p>
    <p v-if="description" class="text-sm text-gray-600">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
