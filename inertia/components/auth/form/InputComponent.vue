<script setup lang="ts">
const props = defineProps<{
  label: string
  type: 'password' | 'email' | 'text'
  id: string
  placeholder: string
}>()

const model = defineModel()
</script>

<template>
  <div class="my-2">
    <label for="email" class="block text-xs sm:text-sm lg:text-base font-medium text-title mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :name="id"
      :id="props.id"
      class="input"
      :placeholder="placeholder"
      v-model="model"
      required
    />
  </div>
</template>

<style scoped></style>
