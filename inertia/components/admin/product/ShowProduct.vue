<template>
  <div class="min-h-screen bg-#1a1b26 text-white pb-20">
    <!-- Header -->

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto p-4">
      <!-- Product Images/Video Carousel -->
      <div class="mb-8 relative">
        <div
          class="overflow-hidden rounded-xl"
          @mouseenter="stopAutoPlay"
          @mouseleave="startAutoPlay"
        >
          <div
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div v-for="(media, index) in product.medias" :key="index" class="w-full flex-shrink-0">
              <!-- Video -->
              <div v-if="media.type === 'video'" class="aspect-video w-full">
                <iframe
                  :src="getYouTubeEmbedUrl(media.url)"
                  class="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <!-- Image -->

              <img
                v-else
                :src="media.url"
                :alt="`${product.name} - Vue ${index + 1}`"
                class="w-full aspect-video object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        <!-- Thumbnail Navigation -->
        <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
          <button
            v-for="(media, index) in product.medias"
            :key="index"
            @click="goToSlide(index)"
            class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 relative"
            :class="currentSlide === index ? 'border-primary' : 'border-transparent'"
          >
            <img
              v-if="media.type === 'image'"
              :src="media.url"
              :alt="`Thumbnail ${index + 1}`"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-#2a2b36 flex items-center justify-center">
              <div class="i-mdi-play text-2xl text-primary"></div>
            </div>
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-4">
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>

        <!-- Rating -->
        <div class="flex items-center gap-2">
          Catégorie:
          <span class="text-gray-400">({{ product.category.name }})</span>
        </div>

        <!-- Price -->
        <div class="flex items-center gap-3">
          <span class="text-3xl font-bold">{{ (product.price * (1 - product.discount / 100)).toFixed(2) }} Fcfa</span>
          <span v-if="product.discount>0" class="text-gray-400 line-through text-lg">{{ product.price }} Fcfa</span>
        </div>

        <!-- Statut de validation -->
        <div class="flex items-center gap-3">
          <span class="text-lg font-medium">Statut:</span>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              product.validationStatus === 'approved' ? 'bg-green-100 text-green-800' :
              product.validationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            ]"
          >
            {{ product.validationStatus === 'approved' ? 'Approuvé' :
               product.validationStatus === 'pending' ? 'En attente de validation' :
               'Rejeté' }}
          </span>
        </div>

        <!-- Raison de rejet si existante -->
        <div v-if="product.rejectionReason" class="bg-red-900/20 border border-red-500 rounded p-3">
          <p class="text-sm text-red-400 mb-1">Raison du rejet</p>
          <p class="text-red-300">{{ product.rejectionReason }}</p>
        </div>

        <!-- Description -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Description</h2>
          <p class="text-gray-300 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- Features -->
        <div class="space-y-4">
          <h2 class="text-xl font-bold">Caractéristiques principales :</h2>
          <ul class="space-y-2">
            <li
              v-for="(feature, index) in product.features"
              :key="index"
              class="flex items-start gap-2"
            >
              <div class="i-mdi-check text-primary text-xl mt-0.5"></div>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-2 text-gray-300">
          <div class="flex items-center gap-2">
            <div class="i-mdi-phone"></div>
            <span>+226 03231010 / 07513333</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="i-mdi-web"></div>
            <a href="https://auto-pro.app" class="text-primary">auto-pro.app</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GetProductDto } from '#dto/products_interface'
import { getYouTubeEmbedUrl } from '~/composables/get_youtube_embed'

const props = defineProps<{
  product: GetProductDto
  src: string
}>()

const currentSlide = ref(0)
const autoPlayInterval = ref(null)

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetAutoPlay()
}

const startAutoPlay = () => {
  if (!autoPlayInterval.value) {
    autoPlayInterval.value = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % props.product.medias.length
    }, 1000)
  }
}

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value)
    autoPlayInterval.value = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

// YouTube URL Helper

</script>

<style>
::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .max-w-7xl {
    max-width: 80rem;
  }
}
</style>
