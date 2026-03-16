<script setup lang="ts">
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  products?: number
  orders?: number
  comments?: number
}>()

const goTo = (route: string) => {
  router.visit(route)
}

// Statistiques spécifiques au vendeur
const getStats = (products: number, orders: number, comments: number) => [
  {
    label: "Mes Produits",
    value: products || 0,
    icon: "i-mdi-package-variant",
    bgGradient: "from-blue-600 to-blue-800",
    iconBg: "bg-blue-500",
    textColor: "text-blue-200",
    route: "/seller/products"
  },
  {
    label: "Commandes",
    value: orders || 0,
    icon: "i-mdi-cart",
    bgGradient: "from-green-600 to-green-800",
    iconBg: "bg-green-500",
    textColor: "text-green-200",
    route: "/seller/orders"
  },
  {
    label: "Commentaires",
    value: comments || 0,
    icon: "i-mdi-comment-multiple",
    bgGradient: "from-purple-600 to-purple-800",
    iconBg: "bg-purple-500",
    textColor: "text-purple-200",
    route: "/seller/comments"
  }
]
</script>

<template>
  <div class="px-6 py-8">
    <h3 class="text-primary font-bold text-3xl mb-6">Tableau de bord</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="stat in getStats(products || 0, orders || 0, comments || 0)"
        :key="stat.label"
        class="bg-gradient-to-br rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
        :class="stat.bgGradient"
        @click="goTo(stat.route)"
      >
        <div class="px-6 py-8 flex items-center">
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-opacity-30" :class="stat.iconBg">
            <div :class="['text-3xl text-white', stat.icon]"></div>
          </div>
          <div class="ml-4">
            <h4 class="text-2xl font-semibold text-white">{{ stat.value }}</h4>
            <p :class="stat.textColor">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
