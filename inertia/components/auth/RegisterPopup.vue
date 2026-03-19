<script setup lang="ts">
import { ref, computed } from 'vue'
import { router } from '@inertiajs/vue3'
import InputComponent from '~/components/auth/form/InputComponent.vue'
import MessagePopup from '~/components/admin/product/MessagePopup.vue'
import { PopupType } from '#utils/popup_type_utils'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const step = ref(1) // 1: Select type, 2: Form
const userType = ref<'customer' | 'seller' | null>(null)
const isLoading = ref(false)

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  city: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  neighborhood: '',
})

const showPopup = ref(false)
const popupType = ref<PopupType>(PopupType.SUCCESS)
const popupMessage = ref('')

const closePopup = () => {
  showPopup.value = false
}

const handleSelectType = (type: 'customer' | 'seller') => {
  userType.value = type
  step.value = 2
}

const backToType = () => {
  step.value = 1
  userType.value = null
}

const close = () => {
  emit('close')
  // Reset state
  setTimeout(() => {
    step.value = 1
    userType.value = null
    form.value = {
      fullName: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      neighborhood: '',
    }
  }, 300)
}

function handleSubmit() {
  if (form.value.fullName.length < 3) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Le nom doit contenir au moins 3 caractères'
    return
  }

  if (form.value.password.length < 8) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  isLoading.value = true
  
  const payload = {
    ...form.value,
    isSeller: userType.value === 'seller'
  }

  router.post('/auth/register', payload, {
    onSuccess: () => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.SUCCESS
      popupMessage.value = 'Compte créé avec succès !'
      setTimeout(() => {
        close()
        router.visit('/')
      }, 1500)
    },
    onError: (errors) => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.ERROR
      popupMessage.value = Object.values(errors)[0] || 'Erreur lors de l\'inscription'
    },
  })
}
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <!-- Close button -->
        <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2">
          <div class="i-mdi-close h-6 w-6" />
        </button>

        <div class="p-8">
          <div class="flex justify-center mb-6">
            <img class="h-16 rounded-xl" src="https://auto-cdn.uvatis.com/logo/logo.png" alt="Logo Auto-pro" />
          </div>

          <h2 class="text-2xl font-bold text-gray-900 text-center mb-2">
            {{ step === 1 ? 'Créer un compte' : (userType === 'seller' ? 'Devenir Vendeur' : 'Inscription Client') }}
          </h2>
          <p class="text-gray-500 text-center mb-8 text-sm">
            {{ step === 1 ? 'Choisissez le type de compte qui vous correspond' : 'Veuillez remplir les informations ci-dessous' }}
          </p>

          <!-- Step 1: Selection -->
          <div v-if="step === 1" class="space-y-4">
            <button 
              @click="handleSelectType('customer')"
              class="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition group text-left"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <div class="i-mdi-account text-primary h-6 w-6" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Client simple</h3>
                <p class="text-xs text-gray-500">Pour acheter et suivre vos commandes</p>
              </div>
              <div class="i-mdi-chevron-right ml-auto text-gray-400 group-hover:text-primary transition h-5 w-5" />
            </button>

            <button 
              @click="handleSelectType('seller')"
              class="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition group text-left"
            >
              <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                <div class="i-mdi-store text-primary h-6 w-6" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900">Vendeur professionnel</h3>
                <p class="text-xs text-gray-500">Pour vendre vos véhicules et accessoires</p>
              </div>
              <div class="i-mdi-chevron-right ml-auto text-gray-400 group-hover:text-primary transition h-5 w-5" />
            </button>
          </div>

          <!-- Step 2: Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
            <InputComponent
              id="fullName"
              type="text"
              :placeholder="userType === 'seller' ? 'Nom du contact' : 'Entrez votre nom complet'"
              :label="userType === 'seller' ? 'Nom complet du contact' : 'Nom complet'"
              v-model="form.fullName"
              required
            />

            <template v-if="userType === 'seller'">
              <InputComponent
                id="companyName"
                type="text"
                placeholder="Nom de votre boutique"
                label="Nom de l'entreprise / Boutique"
                v-model="form.companyName"
                required
              />
            </template>

            <template v-if="userType === 'seller'">
              <InputComponent
                id="email"
                type="email"
                placeholder="votre@email.com"
                label="Email"
                v-model="form.email"
                required
              />
            </template>

            <div class="grid gap-4" :class="userType === 'seller' ? 'grid-cols-2' : 'grid-cols-1'">
              <InputComponent
                id="phone"
                type="text"
                placeholder="Numéro de téléphone"
                label="Téléphone"
                v-model="form.phone"
                required
              />
              <InputComponent
                v-if="userType === 'seller'"
                id="city"
                type="text"
                placeholder="Votre ville"
                label="Ville"
                v-model="form.city"
                required
              />
            </div>

            <template v-if="userType === 'seller'">
              <InputComponent
                id="neighborhood"
                type="text"
                placeholder="Votre quartier"
                label="Quartier"
                v-model="form.neighborhood"
                required
              />
            </template>

            <InputComponent
              id="password"
              type="password"
              placeholder="••••••••"
              label="Mot de passe"
              v-model="form.password"
              required
            />

            <InputComponent
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              label="Confirmer le mot de passe"
              v-model="form.confirmPassword"
              required
            />

            <div class="flex gap-3 pt-4 sticky bottom-0 bg-white">
              <button
                type="button"
                @click="backToType"
                class="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Retour
              </button>
              <button
                type="submit"
                class="flex-[2] bg-primary text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition flex items-center justify-center gap-2"
                :disabled="isLoading"
              >
                <div v-if="isLoading" class="i-line-md:loading-loop w-5 h-5" />
                {{ isLoading ? 'Création...' : (userType === 'seller' ? 'Devenir Vendeur' : 'S\'inscrire') }}
              </button>
            </div>
          </form>

          <div v-if="step === 1" class="mt-8 text-center">
            <p class="text-gray-500 text-sm">
              Vous avez déjà un compte ?
              <Link href="/auth/login" class="text-primary hover:underline font-bold ml-1">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>

      <MessagePopup
        :show="showPopup"
        :type="popupType"
        :message="popupMessage"
        @close-callback="closePopup"
      />
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
