<template>
  <Layout>
    <div class="px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-primary font-bold text-3xl">Gestion des Marques</h3>
        <button
          @click="openCreateModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
        >
          <span class="i-mdi:plus text-xl"></span>
          Ajouter une marque
        </button>
      </div>

      <!-- Messages Flash -->
      <div v-if="page.props.flash?.success" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ page.props.flash.success }}
      </div>
      <div v-if="page.props.flash?.errors?.general" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ page.props.flash.errors.general }}
      </div>

      <div class="bg-white shadow-md rounded my-6">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Produits associés
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brand in brands" :key="brand.id" class="hover:bg-gray-50">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold text-gray-800">
                {{ brand.name }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div class="flex items-center gap-3">
                  <img 
                    :src="getBrandImageUrl(brand)" 
                    :alt="brand.name"
                    class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    @error="handleImageError"
                  />
                  <!-- <div class="text-xs text-gray-500 max-w-xs truncate">
                    {{ brand.url }}
                  </div> -->
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {{ brand.products?.length || 0 }} produit(s)
                </span>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div class="flex items-center gap-2">
                  <button
                    @click="editBrand(brand)"
                    class="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    title="Modifier"
                  >
                    <span class="i-mdi:pencil text-lg"></span>
                    Modifier
                  </button>
                  <button
                    @click="deleteBrand(brand.id)"
                    class="text-red-600 hover:text-red-900 flex items-center gap-1"
                    title="Supprimer"
                  >
                    <span class="i-mdi:delete text-lg"></span>
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="brands.length === 0">
              <td colspan="4" class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                Aucune marque trouvée
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Créer/Modifier Marque -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md m-4">
          <h2 class="text-2xl font-bold mb-4">{{ editingBrand ? 'Modifier' : 'Créer' }} une marque</h2>
          
          <!-- Erreurs de validation -->
          <div v-if="page.props.flash?.errors" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            <div v-for="(error, field) in page.props.flash.errors" :key="field">
              <strong>{{ field }}:</strong> {{ error }}
            </div>
          </div>
          
          <form @submit.prevent="submitBrand" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nom de la marque *</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Image de la marque</label>
              <div class="space-y-3">
                <div v-if="formData.url && !formData.url.startsWith('http')" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    :src="formData.url" 
                    :alt="formData.name"
                    class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    @error="handleImageError"
                  />
                  <div class="text-sm text-gray-600">
                    <p>Image actuelle</p>
                    <p class="text-xs text-gray-500 truncate max-w-xs">{{ formData.url }}</p>
                  </div>
                </div>
                
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileChange"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Formats acceptés: JPG, PNG, GIF, WebP. Max 5MB.
                  </p>
                </div>
                
                <div v-if="selectedFile" class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <img 
                    :src="previewUrl" 
                    :alt="selectedFile.name"
                    class="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div class="text-sm text-blue-600">
                    <p>Nouvelle image sélectionnée</p>
                    <p class="text-xs">{{ selectedFile.name }}</p>
                    <button 
                      type="button"
                      @click="removeSelectedFile"
                      class="text-xs text-red-600 hover:text-red-800 mt-1"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">URL externe (optionnel)</label>
              <input
                v-model="formData.url"
                type="text"
                placeholder="Laisser vide pour utiliser l'image uploadée"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p class="text-xs text-gray-500 mt-1">
                Si vous remplissez ce champ, l'image uploadée sera ignorée.
              </p>
            </div>

            <div class="flex gap-2">
              <button
                type="submit"
                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {{ editingBrand ? 'Modifier' : 'Créer' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import Layout from '~/components/admin/Layout.vue'

interface Brand {
  id: number
  name: string
  url: string
  products?: any[]
}

const page = usePage()
const brands = page.props.brands as Brand[]

const showCreateModal = ref(false)
const editingBrand = ref<Brand | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const formData = ref({
  name: '',
  url: ''
})

const openCreateModal = () => {
  editingBrand.value = null
  formData.value = { name: '', url: '' }
  selectedFile.value = null
  previewUrl.value = ''
  showCreateModal.value = true
}

const editBrand = (brand: Brand) => {
  editingBrand.value = brand
  formData.value = {
    name: brand.name,
    url: brand.url
  }
  selectedFile.value = null
  previewUrl.value = ''
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingBrand.value = null
  formData.value = { name: '', url: '' }
  selectedFile.value = null
  previewUrl.value = ''
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      target.value = ''
      return
    }
    
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      target.value = ''
      return
    }
    
    selectedFile.value = file
    
    // Créer une preview
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeSelectedFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  // Réinitialiser l'input file
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const submitBrand = () => {
  const url = editingBrand.value 
    ? `/dashboard/brands/edit/${editingBrand.value.id}`
    : '/dashboard/brands/create'

  // Utiliser FormData pour envoyer l'image
  const formDataToSend = new FormData()
  
  // Ajouter les champs du formulaire
  formDataToSend.append('name', formData.value.name)
  
  // Ajouter l'URL seulement si elle est fournie et qu'il n'y a pas de nouvelle image
  if (formData.value.url && !selectedFile.value) {
    formDataToSend.append('url', formData.value.url)
  }
  
  // Ajouter l'image si elle est sélectionnée
  if (selectedFile.value) {
    formDataToSend.append('image', selectedFile.value)
    console.log('📤 Sending image file:', selectedFile.value.name, selectedFile.value.size)
  } else {
    console.log('📤 No image file to send')
  }

  // Debug FormData contents
  console.log('📤 FormData contents:')
  for (let [key, value] of formDataToSend.entries()) {
    console.log(`- ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value)
  }

  router.post(url, formDataToSend, {
    onSuccess: () => {
      closeModal()
      router.reload()
    },
    onError: (errors) => {
      console.error('Validation errors:', errors)
    }
  })
}

const deleteBrand = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette marque ? Cette action est irréversible.')) {
    router.delete(`/dashboard/brands/delete/${id}`)
  }
}

const getBrandImageUrl = (brand: Brand) => {
  // Si l'URL de la marque existe, l'utiliser
  if (brand.url) {
    // Pour les fichiers locaux, s'assurer que l'URL est correcte
    if (brand.url.startsWith('/uploads/')) {
      return brand.url
    }
    // Pour les URLs externes, les remplacer par l'image par défaut locale
    if (brand.url.startsWith('http')) {
      return '/uploads/brands/default-brand.jpg'
    }
    // Sinon, considérer que c'est un chemin local
    return brand.url.startsWith('/') ? brand.url : '/' + brand.url
  }
  // Sinon, utiliser une image par défaut locale
  return '/uploads/brands/default-brand.jpg'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Fallback vers l'image par défaut locale en cas d'erreur
  img.src = '/uploads/brands/default-brand.jpg'
}
</script>
