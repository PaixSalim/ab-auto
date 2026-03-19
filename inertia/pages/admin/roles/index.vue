<script setup lang="ts">
import { ref } from 'vue'
import Layout from '~/components/admin/Layout.vue'
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  roles: any[]
}>()

const showCreateModal = ref(false)
const editingRole = ref<any>(null)

const form = ref({
  name: '',
  slug: ''
})

const handleCreate = () => {
  form.value = { name: '', slug: '' }
  editingRole.value = null
  showCreateModal.value = true
}

const handleEdit = (role: any) => {
  editingRole.value = role
  form.value = { name: role.name, slug: role.slug }
  showCreateModal.value = true
}

const submit = () => {
  if (editingRole.value) {
    router.put(`/dashboard/roles/${editingRole.value.id}`, form.value, {
      onSuccess: () => showCreateModal.value = false
    })
  } else {
    router.post('/dashboard/roles', form.value, {
      onSuccess: () => showCreateModal.value = false
    })
  }
}

const deleteRole = (id: number) => {
  if (confirm('Supprimer ce rôle ?')) {
    router.delete(`/dashboard/roles/${id}`)
  }
}
</script>

<template>
  <Layout title="Gestion Rôles">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-title">Rôles</h1>
        <button @click="handleCreate" class="bg-primary text-white px-4 py-2 rounded-lg">Nouveau Rôle</button>
      </div>

      <div class="bg-background-admin rounded-xl overflow-hidden shadow-sm">
        <table class="w-full text-left">
          <thead class="bg-background-primary border-b border-border-light">
            <tr>
              <th class="px-6 py-4 font-semibold text-description text-sm">Nom</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Slug</th>
              <th class="px-6 py-4 font-semibold text-description text-sm">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light">
            <tr v-for="role in roles" :key="role.id" class="hover:bg-background-primary/50 transition-colors">
              <td class="px-6 py-4 text-title font-medium">{{ role.name }}</td>
              <td class="px-6 py-4 text-description text-sm uppercase font-mono">{{ role.slug }}</td>
              <td class="px-6 py-4 text-sm font-medium">
                <div class="flex items-center gap-3">
                  <button @click="handleEdit(role)" class="text-primary hover:underline">Modifier</button>
                  <button @click="deleteRole(role.id)" class="text-red-500 hover:underline">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Simple Modal -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
          <h2 class="text-xl font-bold mb-6">{{ editingRole ? 'Modifier' : 'Créer' }} Rôle</h2>
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nom</label>
              <input v-model="form.name" type="text" class="w-full border rounded-lg p-2" required placeholder="ex: Modérateur" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Slug</label>
              <input v-model="form.slug" type="text" class="w-full border rounded-lg p-2" required placeholder="ex: moderator" />
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button type="button" @click="showCreateModal = false" class="px-4 py-2 border rounded-lg">Annuler</button>
              <button type="submit" class="bg-primary text-white px-6 py-2 rounded-lg">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>
