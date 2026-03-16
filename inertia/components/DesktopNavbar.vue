<script setup lang="ts">
import SearchBar from '~/components/SearchBar.vue'
import { Link, usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()
const user = computed(() => (page.props as any).auth?.user)

const openLink = () => {
  window.location.href = 'https://api.whatsapp.com/send?phone=22607513333'
}
</script>

<template>
  <header class="hidden md:block bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center">
          <img src="https://auto-cdn.uvatis.com/logo/logo.png" alt="Logo" class="h-25 w-25 mr-3" />
        </div>


        <div class="flex items-center space-x-4">
          <button @click="openLink" class="text-gray-700 dark:text-gray-300">
            <div class="i-mdi-whatsapp h-6 w-6" />
          </button>
          
          <div v-if="!user" class="flex items-center gap-3">
            <Link href="/auth/login" class="text-gray-700 hover:text-primary font-medium transition">
              Connexion
            </Link>
            <Link href="/auth/register" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition font-medium">
              S'inscrire
            </Link>
          </div>
          
          <div v-else class="flex items-center gap-3">
            <div class="relative group">
              <button class="flex items-center gap-2 text-gray-700 hover:text-primary transition">
                <span class="text-gray-700 font-medium">{{ user.fullName || user.email }}</span>
                <div class="i-mdi-chevron-down h-4 w-4" />
              </button>
              
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-1">
                  <Link href="/orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    <div class="flex items-center gap-2">
                      <div class="i-mdi-shopping h-4 w-4" />
                      Mes commandes
                    </div>
                  </Link>
                  <Link href="/comments" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    <div class="flex items-center gap-2">
                      <div class="i-mdi-comment h-4 w-4" />
                      Mes commentaires
                    </div>
                  </Link>
                  <div class="border-t border-gray-200 my-1"></div>
                  <Link href="/auth/logout" method="post" as="button" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    <div class="flex items-center gap-2">
                      <div class="i-mdi-logout h-4 w-4" />
                      Déconnexion
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="pb-3 bg-background-secondary rounded-lg">
        <SearchBar />
      </div>
    </div>
  </header>
</template>
