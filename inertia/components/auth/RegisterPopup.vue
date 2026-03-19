<script setup lang="ts">
import { ref, computed } from 'vue'
import { router, Link } from '@inertiajs/vue3'
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
        router.visit(userType.value === 'seller' ? '/seller' : '/')
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
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="bg-background-admin border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative animate-in fade-in zoom-in duration-300">
        
        <!-- Decoration Gradient -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

        <!-- Close button -->
        <button @click="close" class="absolute top-5 right-5 text-description hover:text-white transition-all bg-white/5 hover:bg-white/10 p-2 rounded-full">
          <div class="i-mdi-close h-5 w-5" />
        </button>

        <div class="p-8 relative">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <img class="h-16 relative rounded-xl" src="https://auto-cdn.uvatis.com/logo/logo.png" alt="Logo Auto-pro" />
            </div>
          </div>

          <h2 class="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
            {{ step === 1 ? 'Rejoindre AB Auto' : (userType === 'seller' ? 'Devenir Vendeur' : 'Créer un compte') }}
          </h2>
          <p class="text-description text-center mb-8 text-sm font-medium">
            {{ step === 1 ? 'Choisissez votre profil pour commencer' : 'Rejoignez la communauté AB Auto dès aujourd\'hui' }}
          </p>

          <!-- Step 1: Selection -->
          <div v-if="step === 1" class="space-y-4">
            <button 
              @click="handleSelectType('customer')"
              class="w-full flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group text-left relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:to-primary/5 transition-all duration-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <div class="i-mdi-account text-primary h-7 w-7" />
              </div>
              <div class="relative">
                <h3 class="font-bold text-white text-lg">Client</h3>
                <p class="text-sm text-description group-hover:text-gray-300 transition-colors">Achetez en toute simplicité</p>
              </div>
              <div class="i-mdi-arrow-right ml-auto text-description group-hover:text-primary group-hover:translate-x-1 transition-all h-6 w-6" />
            </button>

            <button 
              @click="handleSelectType('seller')"
              class="w-full flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group text-left relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:to-primary/5 transition-all duration-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <div class="i-mdi-store text-primary h-7 w-7" />
              </div>
              <div class="relative">
                <h3 class="font-bold text-white text-lg">Vendeur Pro</h3>
                <p class="text-sm text-description group-hover:text-gray-300 transition-colors">Boostez vos ventes de véhicules</p>
              </div>
              <div class="i-mdi-arrow-right ml-auto text-description group-hover:text-primary group-hover:translate-x-1 transition-all h-6 w-6" />
            </button>
          </div>

          <!-- Step 2: Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-5 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar scroll-smooth">
            <div class="space-y-1">
              <InputComponent
                id="fullName"
                type="text"
                :placeholder="userType === 'seller' ? 'Ex: Garage de l\'Espace' : 'Votre nom complet'"
                :label="userType === 'seller' ? 'Nom de la structure' : 'Nom complet'"
                v-model="form.fullName"
                required
              />
            </div>

            <div v-if="userType === 'seller'" class="space-y-4 animate-in slide-in-from-left duration-300">
               <InputComponent
                id="companyName"
                type="text"
                placeholder="Nom commercial"
                label="Nom commercial / Boutique"
                v-model="form.companyName"
                required
              />
              <InputComponent
                id="email"
                type="email"
                placeholder="votre@email.com"
                label="Email professionnel (Optionnel)"
                v-model="form.email"
              />
            </div>

            <div class="grid gap-4" :class="userType === 'seller' ? 'grid-cols-2' : 'grid-cols-1'">
              <InputComponent
                id="phone"
                type="text"
                placeholder="+226 ..."
                label="Téléphone (Obligatoire)"
                v-model="form.phone"
                required
              />
              <InputComponent
                v-if="userType === 'seller'"
                id="city"
                type="text"
                placeholder="Ville"
                label="Ville"
                v-model="form.city"
                required
              />
            </div>

            <template v-if="userType === 'seller'">
              <InputComponent
                id="neighborhood"
                type="text"
                placeholder="Ex: Cocody Angré"
                label="Quartier / Zone"
                v-model="form.neighborhood"
                required
              />
            </template>

            <div class="grid grid-cols-2 gap-4">
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
                label="Confirmation"
                v-model="form.confirmPassword"
                required
              />
            </div>

            <div class="flex gap-4 pt-6 sticky bottom-0 bg-background-admin/90 backdrop-blur-sm pb-2">
              <button
                type="button"
                @click="backToType"
                class="flex-1 px-4 py-4 rounded-2xl border border-white/10 font-bold text-description hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                Retour
              </button>
              <button
                type="submit"
                class="flex-[2] bg-primary text-white px-4 py-4 rounded-2xl font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(190,22,34,0.3)] hover:shadow-[0_15px_40px_rgba(190,22,34,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                :disabled="isLoading"
              >
                <div v-if="isLoading" class="i-line-md:loading-loop w-5 h-5" />
                {{ isLoading ? 'Action...' : (userType === 'seller' ? 'Lancer ma boutique' : 'Créer mon compte') }}
              </button>
            </div>
          </form>

          <div v-if="step === 1" class="mt-10 text-center animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <p class="text-description text-sm flex items-center justify-center gap-2">
              Déjà membre ?
              <Link href="/auth/login" class="text-primary hover:text-white hover:underline font-extrabold transition-all">Se connecter</Link>
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
