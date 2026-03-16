<template>
  <div class="mx-auto px-4 my-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Tous nos produits</h2>
      <a href="/catalogue" class="text-primary hover:underline flex items-center gap-2">
        Voir tout le catalogue
        <span class="i-mdi:arrow-right"></span>
      </a>
    </div>

    <!-- Filtres par catégorie -->
    <div class="flex gap-2 my-6 overflow-x-auto pb-2 scrollbar-hide">
      <button
        @click="selectedCategory = null"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
          selectedCategory === null
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        Tous
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
          selectedCategory === category.id
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Grille de produits -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts.slice(0, 8)"
        :key="product.id"
        class="rounded-2xl p-4 transition-transform border hover:scale-[1.02] bg-white"
      >
        <div class="relative aspect-square mb-4">
          <img
            @click="navigateToProduct(product)"
            :src="product.medias && product.medias.length > 0 ? product.medias[0].url : 'https://via.placeholder.com/300'"
            :alt="product.name"
            class="w-full h-full object-contain hover:border hover:border-primary rounded-lg cursor-pointer"
          />
          <span
            v-if="product.state === 'new'"
            class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Neuf
          </span>
          <span
            v-else
            class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Occasion
          </span>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold text-lg line-clamp-2">{{ product.name }}</h3>
          <p class="text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
          
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="i-mdi:tag"></span>
            <span>{{ product.category?.name }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-primary">
              {{ formatPrice(product.price) }} FCFA
            </span>
          </div>

          <button
            class="w-full bg-primary hover:bg-primary/80 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            @click="navigateToProduct(product)"
          >
            Voir détails
            <span class="i-mdi:arrow-right"></span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="text-center py-12">
      <p class="text-gray-500">Aucun produit disponible dans cette catégorie</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'

interface Product {
  id: number
  name: string
  description: string
  price: number
  slug: string
  state: string
  category?: { id: number; name: string }
  medias?: { url: string }[]
}

interface Category {
  id: number
  name: string
}

const props = defineProps<{
  products: Product[]
  categories: Category[]
}>()

const selectedCategory = ref<number | null>(null)

const filteredProducts = computed(() => {
  if (selectedCategory.value === null) {
    return props.products
  }
  return props.products.filter(p => p.category?.id === selectedCategory.value)
})

function navigateToProduct(product: Product) {
  router.get(`/catalogue/product/${product.slug}`)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price)
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
