<template>
  <section>
    <div class="w-full relative overflow-hidden rounded-lg">
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div v-for="(banner, index) in banners" :key="index" class="w-full flex-shrink-0 relative">
          <img
            :src="banner.image"
            :alt="banner.title"
            class="w-full h-44 md:h-80 lg:h-96 object-cover rounded-lg"
          />
          <div
            class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-end p-6 text-white"
          >
            <h3 class="hidden md:block text-xl md:text-2xl font-bold mb-2">{{ banner.title }}</h3>
            <p class="hidden md:block text-sm md:text-base mb-4">{{ banner.description }}</p>
            <button
              @click="router.get('/catalogue')"
              class="hidden md:block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md w-max transition-colors duration-300"
            >
              Tout voir
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation dots -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(_, index) in banners"
          :key="index"
          @click="goToSlide(index)"
          class="w-2 h-2 rounded-full transition-colors duration-300"
          :class="currentSlide === index ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'"
          aria-label="Go to slide"
        ></button>
      </div>

      <!-- Arrow navigation -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon class="w-6 h-6" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { BannerInterface } from '#dto/banners_interface'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  banners: BannerInterface[]
  autoplay: boolean
  interval: number
}>()

const currentSlide = ref(0)
let autoplayInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.banners.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.banners.length) % props.banners.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  if (props.autoplay) {
    autoplayInterval = setInterval(() => {
      nextSlide()
    }, props.interval)
  }
}

const stopAutoplay = () => {
  clearInterval(autoplayInterval)
}

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>
