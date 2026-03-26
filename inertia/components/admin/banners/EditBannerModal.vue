<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Modifier la bannière</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span class="i-mdi:close text-2xl"></span>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le titre de la bannière"
            />
            <div v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez la description de la bannière"
            ></textarea>
            <div v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</div>
          </div>

          <!-- Lien -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Lien (optionnel)</label>
            <input
              v-model="form.link"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemple.com ou #"
            />
          </div>

          <!-- Image actuelle -->
          <div v-if="currentImage" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Image actuelle</label>
            <img 
              :src="currentImage" 
              alt="Image actuelle" 
              class="w-full h-48 object-cover rounded-md border border-gray-200"
            />
          </div>

          <!-- Nouvelle image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nouvelle image (optionnel)</label>
            <div class="space-y-2">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="imagePreview" class="mt-2">
                <img 
                  :src="imagePreview" 
                  alt="Aperçu de la nouvelle image" 
                  class="w-full h-48 object-cover rounded-md border border-gray-200"
                />
                <p class="text-sm text-green-600 mt-1">Nouvelle image (remplacera l'image actuelle)</p>
              </div>
              <div v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="isLoading" class="i-line-md:loading-loop animate-spin"></span>
              {{ isLoading ? 'Modification...' : 'Modifier la bannière' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  banner: any
}>()

const emit = defineEmits(['close', 'updated'])

const isLoading = ref(false)
const fileInput = ref<HTMLInputElement>()
const imagePreview = ref<string>()
const currentImage = ref<string>()
const errors = ref<Record<string, string>>({})

const form = ref({
  title: '',
  description: '',
  link: '',
  image: null as File | null
})

// Initialise le formulaire avec les données de la bannière
watch(() => props.banner, (banner) => {
  if (banner) {
    form.value = {
      title: banner.title || '',
      description: banner.description || '',
      link: banner.link || '',
      image: null
    }
    currentImage.value = getBannerImageUrl(banner)
    imagePreview.value = undefined
  }
}, { immediate: true })

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    form.value.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Le titre est requis'
    return
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'La description est requise'
    return
  }
  
  isLoading.value = true
  
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('link', form.value.link || '#')
  if (form.value.image) {
    formData.append('image', form.value.image)
  }
  
  router.post(`/dashboard/banners/edit/${props.banner.id}`, formData, {
    onSuccess: () => {
      isLoading.value = false
      emit('updated')
    },
    onError: (error) => {
      isLoading.value = false
      errors.value = error as Record<string, string>
    }
  })
}

const getBannerImageUrl = (banner: any) => {
  if (!banner.image) return '/uploads/banners/default-banner.jpg'
  
  // Si c'est déjà une URL locale, la retourner
  if (banner.image.startsWith('/uploads/')) {
    return banner.image
  }
  
  // Sinon, considérer que c'est un chemin local
  return banner.image.startsWith('/') ? banner.image : '/' + banner.image
}
</script>
