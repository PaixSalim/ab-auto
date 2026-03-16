<template>
  <Layout>
    <div class="p-6">
      <h1 class="text-3xl font-bold text-title mb-6">Commentaires sur mes produits</h1>

      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-description text-lg">Aucun commentaire pour le moment</p>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-background-admin rounded-lg shadow-md p-6"
        >
          <div class="flex items-center gap-4 mb-4 border-b pb-4">
            <img
              v-if="product.medias && product.medias.length > 0"
              :src="product.medias[0].url"
              :alt="product.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div>
              <h2 class="text-xl font-bold text-title">{{ product.name }}</h2>
              <p class="text-sm text-primary">{{ product.comments?.length || 0 }} commentaire(s)</p>
            </div>
          </div>

          <div v-if="product.comments && product.comments.length > 0" class="space-y-4">
            <div
              v-for="comment in product.comments"
              :key="comment.id"
              class="border-l-4 border-primary pl-4"
            >
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-semibold text-black">{{ comment.user || 'Client anonyme' }}</p>
                    <p class="text-sm text-description">{{ formatDate(comment.createdAt) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      :class="comment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ comment.isActive ? 'Actif' : 'Inactif' }}
                    </span>
                    <button
                      @click="toggleCommentStatus(comment.id)"
                      :class="comment.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
                      class="text-white px-3 py-1 rounded text-xs font-semibold"
                    >
                      {{ comment.isActive ? 'Désactiver' : 'Activer' }}
                    </button>
                  </div>
                </div>
                <p class="text-description mb-3">{{ comment.comment }}</p>

                <button
                  v-if="!replyingTo[comment.id]"
                  @click="startReply(comment.id)"
                  class="text-primary hover:underline text-sm flex items-center gap-1"
                >
                  <span class="i-mdi:reply"></span>
                  Répondre
                </button>

                <!-- Formulaire de réponse -->
                <div v-if="replyingTo[comment.id]" class="mt-3 bg-white p-3 rounded border">
                  <textarea
                    v-model="replyText[comment.id]"
                    placeholder="Votre réponse..."
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    rows="3"
                  ></textarea>
                  <div class="flex gap-2">
                    <button
                      @click="submitReply(comment.id)"
                      class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    >
                      Envoyer
                    </button>
                    <button
                      @click="cancelReply(comment.id)"
                      class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                  </div>
                </div>

                <!-- Réponses existantes -->
                <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 ml-6 space-y-2">
                  <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="bg-blue-50 rounded-lg p-3"
                  >
                    <div class="flex justify-between items-start mb-1">
                      <p class="font-semibold text-sm text-black">{{ reply.user || 'Client anonyme' }}</p>
                      <p class="text-xs text-description">{{ formatDate(reply.createdAt) }}</p>
                    </div>
                    <p class="text-sm text-description">{{ reply.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4 text-description">
            Aucun commentaire sur ce produit
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

interface Comment {
  id: number
  user: string
  comment: string
  isActive: boolean
  createdAt: string
  replies?: Comment[]
}

interface Product {
  id: number
  name: string
  category?: { name: string }
  medias?: { url: string }[]
  comments?: Comment[]
}

const props = defineProps<{
  products: Product[]
}>()

const replyingTo = ref<Record<number, boolean>>({})
const replyText = ref<Record<number, string>>({})

function startReply(commentId: number) {
  replyingTo.value[commentId] = true
  replyText.value[commentId] = ''
}

function cancelReply(commentId: number) {
  replyingTo.value[commentId] = false
  replyText.value[commentId] = ''
}

function submitReply(commentId: number) {
  if (!replyText.value[commentId]?.trim()) {
    alert('Veuillez entrer une réponse')
    return
  }

  router.post('/seller/comments/reply', {
    commentId: commentId,
    comment: replyText.value[commentId],
  }, {
    onSuccess: () => {
      cancelReply(commentId)
    },
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toggleCommentStatus(commentId: number) {
  router.put('/seller/comments/toggle', {
    commentId: commentId,
  }, {
    preserveScroll: true,
  })
}
</script>
