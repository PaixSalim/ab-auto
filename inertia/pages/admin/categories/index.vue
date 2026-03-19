<template>
  <Layout>
    <div class="px-6 py-8">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-primary font-bold text-3xl">Gestion des Catégories</h3>
        <button
          @click="openCreateModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Ajouter une catégorie
        </button>
      </div>

      <div class="bg-white shadow-md rounded my-6">
        <table class="min-w-full leading-normal">
          <thead>
            <tr>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                URL
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Sous-catégories
              </th>
              <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                {{ category.name }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {{ category.url }}
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {{ category.subCategories?.length || 0 }} sous-catégorie(s)
                </span>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                  @click="editCategory(category)"
                  class="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Modifier
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Créer/Modifier Catégorie -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md m-4">
          <h2 class="text-2xl font-bold mb-4">{{ editingCategory ? 'Modifier' : 'Créer' }} une catégorie</h2>
          
          <form @submit.prevent="submitCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nom de la catégorie *</label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">URL (optionnel)</label>
              <input
                v-model="formData.url"
                type="text"
                placeholder="Auto-généré si vide"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Catégorie parent (optionnel)</label>
              <select
                v-model="formData.parentId"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Aucune (catégorie principale)</option>
                <option v-for="cat in categories.filter(c => !c.parentId)" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="flex gap-2">
              <button
                type="submit"
                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {{ editingCategory ? 'Modifier' : 'Créer' }}
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
import { router } from '@inertiajs/vue3'
import Layout from '~/components/admin/Layout.vue'

interface Category {
  id: number
  name: string
  url: string
  parentId: number | null
  subCategories?: Category[]
}

const props = defineProps<{
  categories: Category[]
}>()

const showCreateModal = ref(false)
const editingCategory = ref<Category | null>(null)
const formData = ref({
  name: '',
  url: '',
  parentId: ''
})

const openCreateModal = () => {
  editingCategory.value = null
  formData.value = { name: '', url: '', parentId: '' }
  showCreateModal.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    url: category.url,
    parentId: category.parentId?.toString() || ''
  }
  showCreateModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  editingCategory.value = null
  formData.value = { name: '', url: '', parentId: '' }
}

const submitCategory = () => {
  const url = editingCategory.value 
    ? `/dashboard/categories/edit/${editingCategory.value.id}`
    : '/dashboard/categories/create'

  router.post(url, formData.value, {
    onSuccess: () => {
      closeModal()
    },
    onError: () => {
      alert('Erreur lors de la soumission')
    }
  })
}

const deleteCategory = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    router.delete(`/dashboard/categories/delete/${id}`)
  }
}
</script>
