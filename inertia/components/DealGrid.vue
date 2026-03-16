<template>
  <div v-if="useStore.promotedProducts.length > 0" class="mx-auto px-4">
    <!-- Navigation Tabs -->
    <h2 class="text-2xl font-bold py-3">Nos promotions en cours</h2>
    <img class="rounded-lg" src="https://auto-cdn.uvatis.com/promos/banner.jpg" alt="Promotions en cours" />

    <div class="flex gap-2 my-6 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="tab in dynamicTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
          activeTab === tab.id
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        :class="[
          'rounded-2xl p-4 transition-transform border hover:scale-[1.02]'
        ]"
      >
        <div class="relative aspect-square mb-4">
          <img @click="navigateToProduct(product)"
            :src="product.url"
            :alt="product.name"
            class="w-full hover:(border border-primary rounded-lg cursor-pointer) h-full object-contain"
          />
          <span
            class="absolute top-2 left-2 bg-state-error text-white bg-primary rounded-full text-xs px-2 py-1 rounded"
          >
                    -{{ product.discountPercent }}%
                  </span>
        </div>

        <div class="space-y-2">
          <h3 class="font-semibold text-lg">{{ product.name }}</h3>

          <span class="text-sm  text-gray-900">

            {{ product.promoPrice }} Fcfa
            <span class="line-through text-gray-400" v-if="product.discountPercent">{{ product.originalPrice }} Fcfa</span>
          </span>

          <button
            class="w-full bg-primary hover:bg-[#FD671A]/80 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            @click="navigateToProduct(product)"
          >
            En profiter
            <div class="i-mdi-cart w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '~/stores/product_store.js'
import pinia from '~/stores/pinia.js'
import { router } from '@inertiajs/vue3'
import { GetPromotedProductsDto } from '#dto/promoted_products_dto'



const useStore = useProductStore(pinia())

onMounted(() => {
  useStore.fetchPromotedProducts()
})

const activeTab = ref('tout')

const dynamicTabs = computed(() => {
  const categories = new Set(useStore.promotedProducts.map((product) => product.category))
  return [{ id: 'tout', name: 'Tout' }, ...Array.from(categories).map((category) => ({ id: category, name: category }))]
})

const filteredProducts = computed(() => {
  if (activeTab.value === 'tout') {
    return useStore.promotedProducts
  }
  return useStore.promotedProducts.filter((product) => product.category === activeTab.value)
})

const navigateToProduct = (product: GetPromotedProductsDto) => {
  router.get(`/catalogue/product/${product.slug}`)
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

.transition-transform {
  transition: transform 0.2s ease-in-out;
}
</style>
