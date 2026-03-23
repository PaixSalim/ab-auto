<template>
  <Layout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-black">Gestion des Clients</h1>
        <button
          @click="showCreateModal = true"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
        >
          <span class="i-mdi:plus text-xl"></span>
          Nouveau client
        </button>
      </div>

      <PaginatedList
        :items="customers"
        :headers="customerHeaders"
        :items-per-page="10"
        item-name="clients"
        empty-message="Aucun client pour le moment."
      >
        <template #cell-fullName="{ item }">
          <span class="font-medium text-white">{{ item.fullName }}</span>
        </template>
        <template #cell-email="{ item }">
          <span class="text-gray-300">{{ item.email }}</span>
        </template>
        <template #cell-phone="{ item }">
          <span class="text-gray-300">{{ item.phone || '—' }}</span>
        </template>
        <template #cell-createdAt="{ item }">
          <span class="text-gray-300">{{ formatDate(item.createdAt) }}</span>
        </template>
        <template #cell-actions="{ item }">
          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(item)"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <span class="i-mdi:pencil"></span>
              Modifier
            </button>
            <button
              @click="deleteCustomer(item.id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1"
            >
              <span class="i-mdi:delete"></span>
              Supprimer
            </button>
          </div>
        </template>
      </PaginatedList>

      <!-- Modal Créer client -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Créer un nouveau client</h2>
          <form @submit.prevent="createCustomer">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Nom de l'entreprise</label>
              <input v-model="formData.fullName" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Email</label>
              <input v-model="formData.email" type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Téléphone</label>
              <input v-model="formData.phone" type="tel" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: +22600000000" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Mot de passe</label>
              <input v-model="formData.password" type="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required minlength="8" />
              <p class="text-xs text-description mt-1">Minimum 8 caractères</p>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">Créer</button>
              <button type="button" @click="closeModal" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Modifier client -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold mb-4">Modifier le client</h2>
          <form @submit.prevent="updateCustomer">
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Nom de l'entreprise</label>
              <input v-model="editData.fullName" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Email</label>
              <input v-model="editData.email" type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Téléphone</label>
              <input v-model="editData.phone" type="tel" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ex: +22600000000" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium mb-2">Nouveau mot de passe <span class="text-description font-normal">(laisser vide pour ne pas changer)</span></label>
              <input v-model="editData.password" type="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" minlength="8" />
            </div>
            <div class="flex gap-2">
              <button type="submit" class="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">Enregistrer</button>
              <button type="button" @click="closeModal" class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Annuler</button>
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
import PaginatedList from '~/components/admin/PaginatedList.vue'

interface Customer {
  id: number
  fullName: string
  email: string
  phone: string | null
  createdAt: string
}

const props = defineProps<{ customers: Customer[] }>()

// Définition des en-têtes pour le tableau
const customerHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Nom de l\'entreprise' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'createdAt', label: 'Date d\'inscription' },
  { key: 'actions', label: 'Actions', textClass: 'text-right' }
]

const showCreateModal = ref(false)
const showEditModal = ref(false)

const formData = ref({ fullName: '', email: '', phone: '', password: '' })
const editData = ref({ id: 0, fullName: '', email: '', phone: '', password: '' })

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  formData.value = { fullName: '', email: '', phone: '', password: '' }
  editData.value = { id: 0, fullName: '', email: '', phone: '', password: '' }
}

function openEditModal(customer: Customer) {
  editData.value = { id: customer.id, fullName: customer.fullName, email: customer.email, phone: customer.phone || '', password: '' }
  showEditModal.value = true
}

function createCustomer() {
  router.post('/dashboard/customers/create', formData.value, {
    onSuccess: () => closeModal(),
  })
}

function updateCustomer() {
  router.put('/dashboard/customers/edit', editData.value, {
    onSuccess: () => closeModal(),
  })
}

function deleteCustomer(id: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
    router.delete(`/dashboard/customers/delete/${id}`)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
