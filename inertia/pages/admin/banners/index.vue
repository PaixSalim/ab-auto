<template>
  <Layout>
    <div class="px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-primary font-bold text-3xl">Gestion des Bannières</h3>
        <button
          @click="router.visit('/dashboard/banners/create')"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
        >
          <span class="i-mdi:plus text-xl"></span>
          Ajouter une bannière
        </button>
      </div>

      <!-- Messages Flash -->
      <div v-if="page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ page.props.flash.success }}
      </div>
      <div v-if="page.props.flash?.errors?.general" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ page.props.flash.errors.general }}
      </div>

      <!-- Notification -->
      <div v-if="showNotification" :class="`mb-4 p-4 rounded ${notificationType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`">
        {{ notificationMessage }}
      </div>

      <div class="bg-white shadow-md rounded my-6">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Titre
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Lien
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date de création
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-800">
                {{ banner.title }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-600">
                {{ banner.description.substring(0, 100) }}{{ banner.description.length > 100 ? '...' : '' }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div class="flex items-center gap-3">
                  <img 
                    :src="getBannerImageUrl(banner)" 
                    :alt="banner.title"
                    class="w-16 h-12 object-cover rounded border border-gray-200"
                    @error="handleImageError"
                  />
                  <span class="text-xs text-gray-500">{{ getFileName(banner.image) }}</span>
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <a 
                  v-if="banner.link && banner.link !== '#'" 
                  :href="banner.link" 
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  {{ banner.link }}
                </a>
                <span v-else class="text-gray-400">Aucun</span>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-600">
                {{ formatDate(banner.createdAt) }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="router.visit(`/dashboard/banners/edit/${banner.id}`)"
                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm flex items-center gap-1"
                  >
                    <span class="i-mdi:pencil text-sm"></span>
                    Modifier
                  </button>
                  <button
                    @click="deleteBanner(banner)"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm flex items-center gap-1"
                  >
                    <span class="i-mdi:delete text-sm"></span>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!banners || banners.length === 0" class="text-center py-8 text-gray-500">
          Aucune bannière trouvée
        </div>
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
  banners: any[]
  flash?: any
}>()

const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error'>('success')

const deleteBanner = (banner: any) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la bannière "${banner.title}" ?`)) {
    router.delete(`/dashboard/banners/delete/${banner.id}`, {
      onSuccess: () => {
        showNotification.value = true
        notificationMessage.value = 'Bannière supprimée avec succès'
        notificationType.value = 'success'
        setTimeout(() => {
          showNotification.value = false
        }, 3000)
      },
      onError: () => {
        showNotification.value = true
        notificationMessage.value = 'Erreur lors de la suppression de la bannière'
        notificationType.value = 'error'
        setTimeout(() => {
          showNotification.value = false
        }, 3000)
      }
    })
  }
}

const getBannerImageUrl = (banner: any) => {
  // Les URLs sont déjà formatées par le controller, donc on retourne directement l'image
  console.log('🔍 getBannerImageUrl called with image:', banner.image)
  return banner.image || '/uploads/banners/default-banner.jpg'
}

const getFileName = (path: string) => {
  if (!path) return 'default-banner.jpg'
  return path.split('/').pop() || 'default-banner.jpg'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (event: any) => {
  event.target.src = '/uploads/banners/default-banner.jpg'
}

onMounted(() => {
  // Afficher les notifications flash
  if (props.flash?.success) {
    showNotification.value = true
    notificationMessage.value = props.flash.success
    notificationType.value = 'success'
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
})
</script>
