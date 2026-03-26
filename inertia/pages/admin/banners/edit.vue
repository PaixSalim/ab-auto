<template>
  <Layout>
    <div class="px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-primary font-bold text-3xl">Modifier la bannière</h3>
        <button
          @click="goBack"
          class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
        >
          <span class="i-mdi:arrow-left text-xl"></span>
          Retour
        </button>
      </div>

      <!-- Messages Flash -->
      <div v-if="page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ page.props.flash.success }}
      </div>
      <div v-if="page.props.flash?.errors?.general" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ page.props.flash.errors.general }}
      </div>

      <!-- Erreurs de validation -->
      <div v-if="Object.keys(errors).length > 0" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h4 class="font-bold mb-2">Veuillez corriger les erreurs suivantes :</h4>
        <ul class="list-disc list-inside">
          <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
        </ul>
      </div>

      <div class="bg-white shadow-md rounded-lg p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
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
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez la description de la bannière"
            ></textarea>
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
            <p class="text-sm text-gray-500 mt-1">Lien vers lequel l'utilisateur sera redirigé en cliquant sur la bannière</p>
          </div>

          <!-- Image actuelle -->
          <div v-if="currentImage" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Image actuelle</label>
            <img 
              :src="currentImage" 
              alt="Image actuelle" 
              class="w-full max-w-md h-48 object-cover rounded-md border border-gray-200"
            />
          </div>

          <!-- Nouvelle image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nouvelle image (optionnel)</label>
            <div class="space-y-2">
              <input
                type="file"
                @change="handleFileChange"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="imagePreview" class="mt-2">
                <img 
                  :src="imagePreview" 
                  alt="Aperçu de la nouvelle image" 
                  class="w-full max-w-md h-48 object-cover rounded-md border border-gray-200"
                />
                <p class="text-sm text-green-600 mt-1">Nouvelle image (remplacera l'image actuelle)</p>
              </div>
              <p class="text-sm text-gray-500">Formats acceptés : JPG, PNG, GIF. Taille maximale : 5MB</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-6">
            <button
              type="button"
              @click="goBack"
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
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import Layout from '~/components/admin/Layout.vue'

const page = usePage()

const props = defineProps<{
  banner: any
}>()

const isLoading = ref(false)
const imagePreview = ref<string>()
const currentImage = ref<string>()
const errors = ref<Record<string, string>>({})

const form = ref({
  title: '',
  description: '',
  link: '',
  image: null as File | null
})

onMounted(() => {
  // Initialise le formulaire avec les données de la bannière
  if (props.banner) {
    form.value = {
      title: props.banner.title || '',
      description: props.banner.description || '',
      link: props.banner.link || '',
      image: null
    }
    currentImage.value = getBannerImageUrl(props.banner)
  }
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      target.value = ''
      return
    }
    
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
      router.visit('/dashboard/banners')
    },
    onError: (error) => {
      isLoading.value = false
      errors.value = error as Record<string, string>
    }
  })
}

const goBack = () => {
  router.visit('/dashboard/banners')
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
