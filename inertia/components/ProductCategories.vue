<template>
  <section>
    <div v-if="useStore.categories.length > 0" class="py-12 px-1">
      <h2 class="text-2xl font-bold text-center mb-12">
        Commander on vous livre
      </h2>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="category in useStore.categories"
          :key="category.id"
          class="group relative overflow-hidden"
          @click="openBrandModal(category)"
          @mouseenter="fetchBrandByCategory(category)"
        >
          <!-- Card Background with Gradient -->
          <div class="aspect-square rounded-2xl overflow-hidden bg-white border border-1 p1 transition-transform duration-500 hover:scale-105">
            <!-- Category Icon -->
            <div class="h-full w-full relative flex flex-col items-center justify-between">
              <img
                :src="category.url"
                :alt="category.name"
                class="w-20 h-20 md:(w-36 h-36) transition-all duration-300"
              />

              <!-- Category Info -->
              <div class="text-center">
                <h3 class="md:text-lg ">{{ category.name.length > 15 ? category.name.substring(0, 20) + '...' : category.name }}</h3>
                <span class="text-xs text-gray-400">{{ category.items }} produits</span>
              </div>

              <!-- Hover Effect -->
            </div>
          </div>
        </div>
      </div>

      <!-- Brand Selection Modal -->
      <TransitionRoot appear :show="isModalOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl transform transition-all">
                  <div class="relative">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <DialogTitle class="text-xl font-semibold text-gray-900 dark:text-white">
                        Sélectionnez votre véhicule
                      </DialogTitle>
                      <button
                        @click="closeModal"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <XIcon class="w-6 h-6" />
                      </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 py-4">
                      <!-- Search Bar -->
                      <div class="relative mb-6">
                        <input
                          type="text"
                          v-model="searchQuery"
                          placeholder="Rechercher une marque..."
                          class="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>

                      <!-- Brands Grid -->
                      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        <button
                          v-for="brand in filteredBrands"
                          :key="brand.id"
                          @click="selectBrand(brand)"
                          @mouseenter="hoverBrand(brand)"
                          class="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <img :src="brand.url" :alt="brand.name" class="w-16 h-16 object-contain mb-2" />
                          <span class="text-sm text-center font-medium">{{ brand.name }}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Selected Category Info -->
                    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Catégorie sélectionnée: <span class="font-medium text-gray-900 dark:text-white">{{ selectedCategory?.name }}</span>
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XIcon, SearchIcon } from 'lucide-vue-next'
import pinia from '~/stores/pinia'
import { CategoryDto } from '#dto/category_dto'
import { useProductStore } from '~/stores/product_store'
import { router } from '@inertiajs/vue3'
import { BrandsDto } from '#dto/brands_interface'

const useStore = useProductStore(pinia())
onMounted(() => {
  useStore.fetchCategories()
})

const isModalOpen = ref(false)
const selectedCategory = ref<CategoryDto>()
const searchQuery = ref('')

const filteredBrands = computed(() => {
  if (!searchQuery.value) return useStore.currentBrands
  const query = searchQuery.value.toLowerCase()
  return useStore.currentBrands.filter(brand => brand.name.toLowerCase().includes(query))
})

/**
 * Fetching data on hover
 * @param category
 */
const fetchBrandByCategory = async (category: CategoryDto) => {
  selectedCategory.value = category
  await useStore.fetchBrandByCategory(category.id)
}

const openBrandModal = async (category: CategoryDto) => {
  selectedCategory.value = category
 await fetchBrandByCategory(category)
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  searchQuery.value = ''
}

const hoverBrand = async (brand: BrandsDto) => {
  if (useStore.products.length === 0) {
    await useStore.fetchProducts()
  }
}

const selectBrand = async (brand: BrandsDto) => {
  await useStore.fetchProducts()
  router.get('/catalogue', {
    category: selectedCategory.value!.name,
    brand: brand.name,
  })
  closeModal()
}
</script>

<style scoped>

</style>
