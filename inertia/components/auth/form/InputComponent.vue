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
  <div class="relative group">
    <label 
      :for="id" 
      class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-primary transition-colors"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :type="type"
        :name="id"
        :id="id"
        class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-white/10 transition-all duration-300 shadow-inner"
        :placeholder="placeholder"
        v-model="model"
        required
      />
      <!-- Active state glow -->
      <div class="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500"></div>
    </div>
  </div>
</template>

<style scoped></style>
