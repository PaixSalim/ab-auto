<template>
  <Layout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-title">Mes Produits</h1>
        <button
          @click="showCreateModal = true"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <span class="i-mdi:plus text-xl"></span>
          Ajouter un produit
        </button>
      </div>

      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-description text-lg">Vous n'avez pas encore de produits</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Créer votre premier produit
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-background-admin rounded-lg shadow-md overflow-hidden"
        >
          <img
            v-if="product.medias && product.medias.length > 0"
            :src="product.medias[0].url"
            :alt="product.name"
            class="w-full h-48 object-cover"
          />
          <div
            v-else
            class="w-full h-48 bg-gray-200 flex items-center justify-center"
          >
            <div class="i-mdi:image-off text-6xl text-gray-400"></div>
          </div>

          <div class="p-4">
            <h3 class="text-xl font-semibold text-title mb-2">{{ product.name }}</h3>
            <p class="text-description text-sm mb-2 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center mb-4">
              <span class="text-primary font-bold text-lg">{{ product.price }} FCFA</span>
              <span class="text-sm text-description">{{ product.category?.name }}</span>
            </div>

            <!-- Statut de validation -->
            <div class="mb-4">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  product.validationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  product.validationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]"
              >
                Statut: {{ product.validationStatus === 'approved' ? 'Approuvé ✅' :
                         product.validationStatus === 'pending' ? 'En attente de validation ⏳' :
                         'Rejeté ❌' }}
              </span>
              <div v-if="product.validationStatus === 'pending'" class="mt-2 text-xs text-gray-600">
                💡 Votre produit est en cours de validation par l'administration
              </div>
              <div v-if="product.rejectionReason" class="mt-2 text-xs text-red-600">
                ❌ Raison: {{ product.rejectionReason }}
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="editProduct(product)"
                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <span class="i-mdi:pencil"></span>
                Modifier
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <span class="i-mdi:delete"></span>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Créer/Modifier Produit -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-4">
            <h2 class="text-2xl font-bold">{{ editingProduct ? 'Modifier' : 'Creer' }} un produit</h2>
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <div class="i-mdi-close text-xl"></div>
            </button>
          </div>
          
          <div class="px-6 pb-6">
            <form @submit.prevent="submitProduct" class="space-y-4">
              <!-- Informations principales -->
               <br />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Nom du produit *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    placeholder="Ex: iPhone 15 Pro Max"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Prix (FCFA) *</label>
                  <input
                    v-model="formData.price"
                    type="number"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    placeholder="Ex: 150000"
                  />
                </div>
              </div>

              <!-- Description complète -->
              <div>
                <label class="block text-sm font-medium mb-2">Description complète *</label>
                <textarea
                  v-model="formData.description"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  required
                  placeholder="Decrivez votre produit en detail : caracteristiques, etat, accessoires inclus..."
                ></textarea>
              </div>

              <!-- Catégorie et Marque -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    v-model="formData.categoryId"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selectionner une categorie</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Marque *</label>
                  <select
                    v-model="formData.brandId"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selectionner une marque</option>
                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Etat et Call to Action -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Etat *</label>
                  <select
                    v-model="formData.state"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="new">Neuf</option>
                    <option value="old">Occasion</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Call to Action</label>
                  <select
                    v-model="formData.cta"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="none">Aucun</option>
                    <option value="order">Commander</option>
                    <option value="contact">Contacter</option>
                    <option value="quote">Devis</option>
                  </select>
                </div>
              </div>

              <!-- Images -->
              <InputImage
                label="Images du produit"
                placeholder="Glisser deposer ou cliquer pour ajouter (jusqu'a 5 images)"
                v-model:images="formData.images"
                @select="(files) => addImage(files)"
                @remove="(index) => removeImage(index)"
                @drop="(files) => addImage(files)"
                :is-required="false"
              />

              <!-- Video YouTube -->
              <div>
                <label class="block text-sm font-medium mb-2">Video YouTube (optionnel)</label>
                <input
                  v-model="formData.video"
                  type="text"
                  placeholder="Entrez le lien de la video YouTube"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <!-- Garantie et Caracteristiques -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Garantie</label>
                  <input
                    v-model="formData.warranty"
                    type="text"
                    placeholder="Ex: 6 mois, 1 an, S/A"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Caracteristiques principales</label>
                  <textarea
                    v-model="formData.features"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows="2"
                    placeholder="Ex: Ecran 6.7, 256GB, Double SIM, 5G"
                  ></textarea>
                </div>
              </div>

              <!-- Footer fixe avec boutons d'action -->
              <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6 mt-6">
                <div class="flex gap-2">
                  <button
                    type="submit"
                    class="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  >
                    {{ editingProduct ? 'Modifier' : 'Creer' }}
                  </button>
                  <button
                    type="button"
                    @click="closeModal"
                    class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import Layout from '~/components/seller/Layout.vue'
import InputImage from '~/components/seller/form/InputImage.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category?: { name: string }
  brand?: { name: string }
  medias?: { url: string }[]
  validationStatus?: string
  rejectionReason?: string | null
}

interface Category {
  id: number
  name: string
}

interface Brand {
  id: number
  name: string
}

const props = defineProps<{
  products: Product[]
  categories: Category[]
  brands: Brand[]
}>()

const showCreateModal = ref(false)
const editingProduct = ref<Product | null>(null)
const formData = ref({
  name: '',
  description: '',
  price: '',
  categoryId: '',
  brandId: '',
  state: 'new',
  warranty: '1 mois',
  features: '',
  cta: 'none',
  video: '',
  images: [] as { file: File; type: 'image'; preview: string }[]
})

function closeModal() {
  showCreateModal.value = false
  editingProduct.value = null
  formData.value = {
    name: '',
    description: '',
    price: '',
    categoryId: '',
    brandId: '',
    state: 'new',
    warranty: '1 mois',
    features: '',
    cta: 'none',
    video: '',
    images: []
  }
}

function editProduct(product: Product) {
  editingProduct.value = product
  // TODO: Charger les donnees du produit
  showCreateModal.value = true
}

function submitProduct() {
  const submitData = new FormData()
  
  // Ajouter les champs de base
  submitData.append('name', formData.value.name)
  submitData.append('description', formData.value.description)
  submitData.append('price', formData.value.price)
  submitData.append('categoryId', formData.value.categoryId)
  submitData.append('brandId', formData.value.brandId)
  submitData.append('state', formData.value.state)
  submitData.append('warranty', formData.value.warranty)
  submitData.append('features', formData.value.features)
  submitData.append('cta', formData.value.cta)
  submitData.append('video', formData.value.video)
  
  // Ajouter les images
  formData.value.images.forEach((image, index) => {
    submitData.append(`images[${index}]`, image.file)
  })
  
  const url = editingProduct.value ? `/seller/product/edit` : `/seller/product/create`
  
  router.post(url, submitData, {
    forceFormData: true,
    onSuccess: () => {
      closeModal()
    },
    onError: () => {
      alert('Erreur lors de la soumission du produit')
    }
  })
}

const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
const maxSize = 2 * 1024 * 1024 // 2 Mo

const addImage = (files: File[]): void => {
  files.forEach((image) => {
    if (!allowedTypes.includes(image.type) || image.size > maxSize) {
      alert(`Le fichier ${image.name} est invalide (type ou taille incorrecte)`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        formData.value.images.push({
          file: image,
          type: 'image',
          preview: e.target.result as string,
        })
      }
    }
    reader.readAsDataURL(image)
  })
}

const removeImage = (index: number): void => {
  formData.value.images.splice(index, 1)
}

function deleteProduct(id: number) {
  if (confirm('Etes-vous sur de vouloir supprimer ce produit ?')) {
    router.delete(`/seller/product/delete/${id}`)
  }
}
</script>