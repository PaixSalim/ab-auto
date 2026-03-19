<script setup lang="ts">
import { ref } from 'vue'
import Layout from '~/components/admin/Layout.vue'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  users: any[]
  roles: any[]
}>()

const showCreateModal = ref(false)
const editingUser = ref<any>(null)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  isValidated: true,
  roleId: null as number | null,
  // Seller specific fields
  companyName: '',
  city: '',
  neighborhood: '',
})

const resetForm = () => {
  form.value = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    isValidated: true,
    roleId: null,
    companyName: '',
    city: '',
    neighborhood: '',
  }
  editingUser.value = null
}

const handleCreate = () => {
  resetForm()
  showCreateModal.value = true
}

const handleEdit = (user: any) => {
  editingUser.value = user
  form.value = {
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    password: '', // Leave empty for update
    isValidated: user.isValidated,
    roleId: user.roles[0]?.id || null,
    companyName: user.companyName || '',
    city: user.city || '',
    neighborhood: user.neighborhood || '',
  }
  showCreateModal.value = true
}

const submit = () => {
  if (editingUser.value) {
    router.put(`/dashboard/users/${editingUser.value.id}`, form.value, {
      onSuccess: () => {
        showCreateModal.value = false
      }
    })
  } else {
    router.post('/dashboard/users', form.value, {
      onSuccess: () => {
        showCreateModal.value = false
      }
    })
  }
}

const deleteUser = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    router.delete(`/dashboard/users/${id}`)
  }
}
</script>

<template>
  <Layout title="Gestion Utilisateurs">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-title">Utilisateurs</h1>
        <button 
          @click="handleCreate"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Nouvel Utilisateur
        </button>
      </div>

      <div class="bg-background-admin rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left">
          <thead class="bg-background-primary border-b border-border-light">
            <tr>
              <th class="px-6 py-4 font-semibold text-description text-sm">Nom</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Email / Tel</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Rôles</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Statut</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light">
            <tr v-for="user in users" :key="user.id" class="hover:bg-background-primary/50 transition-colors">
              <td class="px-6 py-4 text-title font-medium">{{ user.fullName }}</td>
              <td class="px-6 py-4 text-description text-sm">
                <div>{{ user.email }}</div>
                <div class="text-xs">{{ user.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="role in user.roles" 
                    :key="role.id"
                    class="px-2 py-0.5 bg-primary/10 text-primary text-[10px] uppercase font-bold rounded"
                  >
                    {{ role.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-[10px] font-bold uppercase',
                    user.isValidated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ user.isValidated ? 'Validé' : 'En attente' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium">
                <div class="flex items-center gap-3">
                  <button @click="handleEdit(user)" class="text-primary hover:underline">Modifier</button>
                  <button @click="deleteUser(user.id)" class="text-red-500 hover:underline">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal placeholder (Simplified for now) -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
          <h2 class="text-xl font-bold mb-6">{{ editingUser ? 'Modifier' : 'Créer' }} Utilisateur</h2>
          
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
              <input v-model="form.fullName" type="text" class="w-full border rounded-lg p-2" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input v-model="form.email" type="email" class="w-full border rounded-lg p-2" required />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input v-model="form.phone" type="text" class="w-full border rounded-lg p-2" />
              </div>
            </div>
            <div v-if="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input v-model="form.password" type="password" class="w-full border rounded-lg p-2" required />
            </div>

            <!-- Role assignment (Single Select) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rôle attribué</label>
              <div class="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-gray-50">
                <label
                  v-for="role in roles"
                  :key="role.id"
                  class="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors"
                  :class="form.roleId === role.id ? 'bg-white shadow-sm ring-1 ring-primary/30' : ''"
                >
                  <input
                    type="radio"
                    :value="role.id"
                    v-model="form.roleId"
                    class="rounded-full text-primary"
                    required
                  />
                  <span class="text-sm font-medium text-gray-700">{{ role.name }}</span>
                </label>
              </div>
              <p v-if="!form.roleId" class="text-xs text-red-500 mt-1">Veuillez sélectionner un rôle.</p>
            </div>

            <!-- Seller Specific Fields -->
            <transition name="fade">
              <div v-if="roles.find(r => r.id === form.roleId)?.slug === 'seller'" class="space-y-4 pt-4 border-t border-dashed">
                <h3 class="text-sm font-bold text-primary uppercase tracking-wider">Informations Boutique</h3>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la Boutique</label>
                  <input v-model="form.companyName" type="text" class="w-full border rounded-lg p-2" placeholder="Ex: AB Auto Express" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input v-model="form.city" type="text" class="w-full border rounded-lg p-2" placeholder="Ex: Douala" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                    <input v-model="form.neighborhood" type="text" class="w-full border rounded-lg p-2" placeholder="Ex: Akwa" />
                  </div>
                </div>
              </div>
            </transition>
            
            <div class="flex items-center gap-2">
              <input v-model="form.isValidated" type="checkbox" id="isValidated" />
              <label for="isValidated" class="text-sm font-medium">Utilisateur validé</label>
            </div>

            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showCreateModal = false" class="px-4 py-2 border rounded-lg">Annuler</button>
              <button type="submit" :disabled="!form.roleId" class="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>
