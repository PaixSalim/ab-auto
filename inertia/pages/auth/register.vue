<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
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
const logoUrl = '/uploads/logos/logo.png'
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
  <div class="min-h-screen bg-background-primary flex items-center justify-center p-4">
    <div class="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <div class="relative bg-background-admin rounded-[15px] p-6 sm:(p-8 mb-5) w-full shadow-lg">
        <div class="flex justify-center mb-1 sm:mb-2">
          <img class="h-25 rounded-2xl" :src="logoUrl" alt="Logo Auto-pro" />
        </div>

        <h1 class="text-2xl text-title sm:text-xl lg:text-4xl font-bold text-center leading-tight mb-3 sm:mb-4">
          Inscription | Auto-pro
        </h1>

        <p class="text-description text-center text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
          Créez votre compte pour profiter de toutes nos fonctionnalités
        </p>

        <form
          class="space-y-4"
          method="POST"
          @submit.prevent="handleSubmit"
        >
          <InputComponent
            id="fullName"
            type="text"
            placeholder="Entrez le nom de votre entreprise"
            label="Nom de l'entreprise"
            v-model="fullName"
          />

          <InputComponent
            id="email"
            type="email"
            placeholder="Entrez votre E-mail"
            label="Email"
            v-model="email"
          />

          <InputComponent
            id="phone"
            type="text"
            placeholder="Entrez votre numéro de téléphone"
            label="Téléphone"
            v-model="phone"
          />

          <InputComponent
            id="city"
            type="text"
            placeholder="Entrez votre ville"
            label="Ville"
            v-model="city"
          />

          <InputComponent
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            label="Mot de passe"
            v-model="password"
          />

          <InputComponent
            id="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            label="Confirmer le mot de passe"
            v-model="confirmPassword"
          />

          <button
            type="submit"
            class="w-full text-title px-4 rounded-lg border border-primary font-semibold py-2 text-sm flex items-center justify-center gap-2 sm:(text-base py-3) lg:(py-2 text-lg) hover:(bg-primary text-white)"
          >
            <span v-if="isLoading" class="i-line-md:loading-loop text-title"></span>
            {{ isLoading ? 'Chargement' : 'S\'inscrire' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-description text-sm">
            Vous avez déjà un compte ?
            <a href="/auth/login" class="text-primary hover:underline font-semibold">Se connecter</a>
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
