<template>
  <aside
    :class="[
      'text-white border-r-1 border-gray-700 transform top-0 left-0 w-64 bg-background-primary h-full overflow-auto ease-in-out transition-all duration-300',
      'sm:translate-x-0 sm:relative sm:z-0',
      isOpen ? 'translate-x-0 z-50' : '-translate-x-full',
      'fixed sm:static',
    ]"
  >
    <div class="flex items-center justify-start mx-4 mt-8">
      <div class="flex items-center">
        <img :src="logoUrl" class="w-15 h-15 rounded-full" alt="Logo Auto-pro" />
        <span class="text-primary text-2xl mx-2 font-semibold">Auto-Pro</span>
      </div>
    </div>

    <nav class="mt-10">
      <Link
        v-for="nav in navs"
        :key="nav.route"
        :class="[
          'flex items-center py-4 text-lg py-2 px-6 hover:(bg-opacity-25 )',
          page.url === nav.route ? 'bg-primary/10  border-l-4 border-primary text-primary' : '',
        ]"
        :href="nav.route"
        prefetch
      >
        <div :class="nav.icon"></div>
        <span class="mx-3">{{ nav.label }}</span>
      </Link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3'

defineProps<{
  isOpen: boolean
}>()

const page = usePage()

const navs = [
  {
    label: 'Dashboard',
    route: '/seller/',
    icon: 'i-mdi-home',
  },
  {
    label: 'Mes Produits',
    route: '/seller/products',
    icon: 'i-mdi-shopping',
  },
  {
    label: 'Commandes',
    route: '/seller/orders',
    icon: 'i-mdi-cart',
  },
  {
    label: 'Commentaires',
    route: '/seller/comments',
    icon: 'i-mdi-comment-text',
  },
]
const logoUrl = '/uploads/logos/logo.png'
</script>
