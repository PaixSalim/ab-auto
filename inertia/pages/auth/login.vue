<script setup lang="ts">
import { ref } from 'vue'
import { router, Link } from '@inertiajs/vue3'
import InputComponent from '~/components/auth/form/InputComponent.vue'
import MessagePopup from '~/components/admin/product/MessagePopup.vue'
import RegisterPopup from '~/components/auth/RegisterPopup.vue'
import { PopupType } from '#utils/popup_type_utils'

//const props = defineProps({ label: String })

const isLoading = ref(false)

const uid = ref('')
const password = ref('')
const showPopup = ref(false)
const showRegisterPopup = ref(false)
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
    console.log('Popup error affiché:', showPopup.value, popupType.value, popupMessage.value)
    setTimeout(() => {
      showPopup.value = false
    }, 1400)
    return
  }
  isLoading.value = true
  const form = new FormData()
  form.append('uid', uid.value.toString().toLowerCase())
  form.append('password', password.value)

  router.post('/auth/login', form, {
    onSuccess: () => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.SUCCESS
      popupMessage.value = 'Connexion réussie ! Redirection en cours...'
      console.log('Popup success affiché:', showPopup.value, popupType.value, popupMessage.value)
      
      // Attendre 2 secondes avant de rediriger pour laisser le temps au toast de s'afficher
      setTimeout(() => {
        showPopup.value = false
        // La redirection se fera automatiquement via Inertia après le onSuccess
      }, 2000)
    },
    onError: (errors) => {
      isLoading.value = false
      showPopup.value = true
      popupType.value = PopupType.ERROR
      popupMessage.value = Object.values(errors)[0] || 'Une erreur est survenue lors de la connexion'
      console.log('Popup error serveur affiché:', showPopup.value, popupType.value, popupMessage.value)
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
          Bon retour sur <span class="text-primary italic">AB Auto</span>
        </h1>

        <p class="text-description text-center text-sm sm:text-base lg:text-lg mb-10 font-medium">
          Connectez-vous pour continuer
        </p>

        <form
          class="space-y-6"
          method="POST"
          @submit.prevent="handleSubmit"
        >
          <InputComponent
            id="uid"
            type="text"
            placeholder="E-mail ou Téléphone"
            label="Email ou Téléphone"
            v-model="uid"
          />

          <InputComponent
            id="password"
            type="password"
            placeholder="••••••••"
            label="Mot de passe"
            v-model="password"
          />

          <div class="text-right">
            <Link href="/auth/forgot-password" class="text-xs font-bold text-description hover:text-white transition-colors">Mot de passe oublié ?</Link>
          </div>

          <button
            type="submit"
            class="w-full bg-primary text-white px-4 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(190,22,34,0.3)] hover:(shadow-[0_15px_40px_rgba(190,22,34,0.4)] -translate-y-0.5) active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 mt-4"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="i-line-md:loading-loop w-6 h-6" />
            <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
          </button>
        </form>

        <div class="mt-10 text-center animate-in fade-in duration-1000 delay-300">
          <p class="text-description text-sm flex items-center justify-center gap-2">
            Pas encore de compte ?
            <button 
              @click="showRegisterPopup = true" 
              class="text-primary hover:text-white hover:underline font-black transition-all bg-transparent border-none p-0 cursor-pointer"
            >
              S'inscrire
            </button>
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

    <RegisterPopup 
      :show="showRegisterPopup" 
      @close="showRegisterPopup = false" 
    />
  </div>
</template>
