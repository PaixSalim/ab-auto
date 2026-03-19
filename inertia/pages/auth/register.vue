<script setup lang="ts">
import { ref } from 'vue'
import { router, Link } from '@inertiajs/vue3'
import InputComponent from '~/components/auth/form/InputComponent.vue'
import MessagePopup from '~/components/admin/product/MessagePopup.vue'
import { PopupType } from '#utils/popup_type_utils'

const isLoading = ref(false)
const fullName = ref('')
const email = ref('')
const phone = ref('')
const city = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPopup = ref(false)
const popupType = ref<PopupType>(PopupType.SUCCESS)
const popupMessage = ref('')

const closePopup = () => {
  showPopup.value = false
}

function handleSubmit() {
  if (fullName.value.length < 3) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Le nom doit contenir au moins 3 caractères'
    setTimeout(() => {
      showPopup.value = false
    }, 1400)
    return
  }

  if (password.value.length < 8) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
    setTimeout(() => {
      showPopup.value = false
    }, 1400)
    return
  }

  if (password.value !== confirmPassword.value) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Les mots de passe ne correspondent pas'
    setTimeout(() => {
      showPopup.value = false
    }, 1400)
    return
  }

  isLoading.value = true
  const form = new FormData()
  form.append('fullName', fullName.value)
  form.append('email', email.value.toString().toLowerCase())
  form.append('phone', phone.value)
  form.append('city', city.value)
  form.append('password', password.value)

  router.post('/auth/register', form, {
    onSuccess: () => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.SUCCESS
      popupMessage.value = 'Compte créé avec succès !'
      setTimeout(() => {
        router.visit('/')
      }, 1500)
    },
    onError: () => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.ERROR
      popupMessage.value = 'Erreur lors de l\'inscription. Email déjà utilisé ?'
      setTimeout(() => {
        showPopup.value = false
      }, 3400)
    },
  })
}
</script>

<template>
  <div class="min-h-screen bg-background-primary flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

    <div class="relative w-full max-w-sm sm:max-w-md lg:max-w-xl animate-in fade-in zoom-in duration-700">
      <div class="relative bg-background-admin border border-white/10 rounded-[30px] p-8 sm:p-10 w-full shadow-2xl backdrop-blur-sm">
        <div class="flex justify-center mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <img class="h-24 relative rounded-2xl" src="https://auto-cdn.uvatis.com/logo.png" alt="Logo Auto-pro" />
          </div>
        </div>

        <h1 class="text-3xl text-white sm:text-4xl font-black text-center leading-tight mb-2 tracking-tighter">
          Bienvenue sur <span class="text-primary italic">AB Auto</span>
        </h1>

        <p class="text-description text-center text-sm sm:text-base lg:text-lg mb-10 font-medium">
          Créez votre compte en quelques secondes
        </p>

        <form
          class="space-y-6"
          method="POST"
          @submit.prevent="handleSubmit"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputComponent
              id="fullName"
              type="text"
              placeholder="Votre nom complet"
              label="Nom complet"
              v-model="fullName"
            />

            <InputComponent
              id="email"
              type="email"
              placeholder="votre@email.com"
              label="Email (Optionnel)"
              v-model="email"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputComponent
              id="phone"
              type="text"
              placeholder="+226 ..."
              label="Téléphone (Obligatoire)"
              v-model="phone"
              required
            />

            <InputComponent
              id="city"
              type="text"
              placeholder="Votre ville"
              label="Ville"
              v-model="city"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputComponent
              id="password"
              type="password"
              placeholder="••••••••"
              label="Mot de passe"
              v-model="password"
            />

            <InputComponent
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              label="Confirmation"
              v-model="confirmPassword"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-primary text-white px-4 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(190,22,34,0.3)] hover:(shadow-[0_15px_40px_rgba(190,22,34,0.4)] -translate-y-0.5) active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 mt-8"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="i-line-md:loading-loop w-6 h-6" />
            <span>{{ isLoading ? 'Création en cours...' : 'S\'inscrire maintenant' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center animate-in fade-in duration-1000 delay-300">
          <p class="text-description text-sm flex items-center justify-center gap-2">
            Déjà un compte ?
            <a href="/auth/login" class="text-primary hover:text-white hover:underline font-black transition-all">Se connecter</a>
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
</template>
