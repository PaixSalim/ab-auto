<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mt-8">
    <h2 class="text-2xl font-bold mb-6">Avis clients ({{ comments.length }})</h2>

    <!-- Formulaire d'ajout de commentaire -->
    <div class="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-semibold mb-4">Laisser un avis</h3>
      <form @submit.prevent="submitComment">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Votre nom</label>
          <input
            v-model="formData.user"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Entrez votre nom"
            :readonly="!!user"
          />
          <p v-if="user" class="mt-1 text-xs text-gray-500">
            Prérempli avec vos informations
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Votre commentaire</label>
          <textarea
            v-model="formData.comment"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            rows="4"
            required
            placeholder="Partagez votre expérience avec ce produit..."
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          <span v-if="isSubmitting" class="i-line-md:loading-loop"></span>
          {{ isSubmitting ? 'Envoi...' : 'Publier mon avis' }}
        </button>
      </form>
    </div>

    <!-- Liste des commentaires -->
    <div v-if="activeComments.length === 0" class="text-center py-8 text-gray-500">
      Aucun avis pour le moment. Soyez le premier à donner votre avis !
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="comment in activeComments"
        :key="comment.id"
        class="border-b pb-6 last:border-b-0"
      >
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span class="i-mdi:account text-2xl text-primary"></span>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div>
                <h4 class="font-semibold">{{ comment.user }}</h4>
                <p class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</p>
              </div>
            </div>
            <p class="text-gray-700">{{ comment.comment }}</p>

            <!-- Réponses -->
            <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-8 space-y-4">
              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="bg-blue-50 p-4 rounded-lg"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span class="i-mdi:store text-xl text-blue-600"></span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <h5 class="font-semibold text-sm">{{ reply.user }}</h5>
                      <span class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Vendeur</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-1">{{ formatDate(reply.createdAt) }}</p>
                    <p class="text-gray-700">{{ reply.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message de succès -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md"
    >
      <span class="i-mdi:clock-outline text-xl"></span>
      <div>
        <p class="font-semibold">Merci pour votre avis !</p>
        <p class="text-sm">Votre commentaire sera visible après modération.</p>
      </div>
    </div>

    <AuthRequiredModal
      v-model="showAuthModal"
      :action="authAction"
      @continue-as-guest="handleGuestComment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import AuthRequiredModal from '~/components/auth/AuthRequiredModal.vue'

interface Comment {
  id: number
  user: string
  comment: string
  isActive: boolean
  createdAt: string
  replies?: Comment[]
}

const props = defineProps<{
  productId: number
  comments: Comment[]
}>()

const { user } = useAuth()

const formData = ref({
  user: user.value?.fullName || '',
  comment: '',
})

const isSubmitting = ref(false)
const showSuccess = ref(false)
const showAuthModal = ref(false)
const authAction = ref<'order' | 'comment'>('comment')

const handleGuestComment = () => {
  // Pour les commentaires en tant qu'invité, on pourrait permettre de commenter sans connexion
  // ou afficher un formulaire simplifié
  submitComment()
}

// Filtrer uniquement les commentaires actifs
const activeComments = computed(() => {
  return props.comments.filter(c => c.isActive)
})

async function submitComment() {
  if (!user.value) {
    showAuthModal.value = true
    authAction.value = 'comment'
    return
  }

  isSubmitting.value = true

  try {
    const res = await fetch('/api/v1/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: props.productId,
        user: formData.value.user,
        comment: formData.value.comment,
        userId: user.value?.id || null,
      }),
    })

    if (!res.ok) throw new Error()

    formData.value = { user: user.value?.fullName || '', comment: '' }
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 4000)
  } catch {
    alert('Erreur lors de l\'envoi du commentaire')
  } finally {
    isSubmitting.value = false
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
