<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'
import InputComponent from '~/components/auth/form/InputComponent.vue'
import MessagePopup from '~/components/admin/product/MessagePopup.vue'
import { PopupType } from '#utils/popup_type_utils'

//const props = defineProps({ label: String })

const isLoading = ref(false)

const email = ref('')
const password = ref('')
const showPopup = ref(false)
const popupType = ref<PopupType>(PopupType.SUCCESS)
const popupMessage = ref('')

const closePopup = () => {
  showPopup.value = false
}

function handleSubmit() {
  if (password.value.length < 6) {
    showPopup.value = true
    popupType.value = PopupType.ERROR
    popupMessage.value = 'Veuillez renseigner un mot de passe valide'
    setTimeout(() => {
      showPopup.value = false
    }, 1400)
    return
  }
  isLoading.value = true
  const form = new FormData()
  form.append('email', email.value.toString().toLowerCase())
  form.append('password', password.value)

  router.post('/auth/login', form, {
    onSuccess: () => {
      isLoading.value = false
    },
    onError: () => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.ERROR
      popupMessage.value = 'Veuillez activer votre compte ou créer un compte d\'abord'
      setTimeout(() => {
        showPopup.value = false
      }, 3400)
    },
  })
}
</script>

<style scoped>
.error-popup {
  color: red;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  margin-top: 10px;
}
</style>

<template>
  <div class="min-h-screen bg-background-primary flex items-center justify-center p-4">
    <div class="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
      <!-- Main card -->
      <div class="relative bg-background-admin rounded-[15px] p-6 sm:(p-8 mb-5) w-full shadow-lg">
        <!-- Logo -->
        <div class="flex justify-center mb-1 sm:mb-2">
          <img class="h-25 rounded-2xl" src="https://auto-cdn.uvatis.com/logo.png" alt="Logo QBC-PLUS " />
        </div>

        <!-- Heading -->
        <h1
          class="text-2xl text-title sm:text-xl lg:text-4xl font-bold text-center leading-tight mb-3 sm:mb-4"
        >
          Connexion | Auto-pro
        </h1>

        <!-- Subheading -->
        <p class="text-description text-center text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
          Connectez vous afin de profiter de toutes les fonctionnalités de notre app
        </p>


        <!-- Form -->
        <form
          class="space-y-4"
          method="POST"
          action=""
          enctype="multipart/form-data"
          @submit.prevent="handleSubmit"
        >
          <InputComponent
            id="email"
            type="text"
            placeholder="Entrez votre E-mail"
            label="Email"
            v-model="email"
          />

          <InputComponent
            id="password"
            type="password"
            placeholder="Entrer votre mot de passe"
            label="Mot de passe"
            v-model="password"
          />

          <button
            type="submit"
            class="w-full text-title px-4 rounded-lg border border-primary font-semibold py-2 text-sm flex items-center justify-center gap-2 sm:(text-base py-3) lg:(py-2 text-lg) hover:(bg-primary text-white)"
          >
            <span v-if="isLoading" class="i-line-md:loading-loop text-title"></span>
            {{ isLoading ? 'Chargement' : 'Se connecter' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-description text-sm">
            Vous n'avez pas de compte ?
            <a href="/auth/register" class="text-primary hover:underline font-semibold">S'inscrire</a>
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
