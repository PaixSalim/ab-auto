<template>
  <div class="relative flex h-screen bg-background-primary overflow-hidden">
    <Toast />
    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navbar -->
      <header class="bg-background-primary border-b-1 border-gray-700 shadow-sm z-10">
        <div class="mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="relative">
              <!-- Add user profile, notifications, etc. here -->
              <button @click="toggleActionMenu" class=" bg-light-500 rounded-full p-1">
                <div :class="['text-2xl', showActionMenu ? 'i-mdi-remove text-primary text-2xl' : 'i-mdi-account text-2xl  text-gray-700']"></div>
              </button>
              <div
                v-if="showActionMenu"
                class="absolute left-0 mt-2 w-48 bg-background-admin border border-1 border-gray-700 text-white rounded-lg z-10"
              >
                <div class="py-1">
                  <button
                    @click="logout"
                    class="block text-left w-full px-4 py-2 text-sm hover:bg-primary"
                  >Déconnexion</button
                  >
                  <button
                    @click="
                       goToHome
                      "
                    class="block text-left w-full rounded-sm px-4 py-2 text-sm hover:bg-primary"
                  >Boutique</button
                  >
                </div>
              </div>
            </div>
            <div class="flex items-center sm:hidden">
              <button
                @click="toggleSidebar"
                class="text-gray-400 focus:outline-none focus:text-gray-700"
              >
                <div v-if="!isSidebarOpen" class="i-mdi-menu text-3xl"></div>
                <div v-else class="i-mdi-close text-2xl"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <slot></slot>
      </main>
    </div>

    <!-- Overlay -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm z-40 sm:hidden"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { router } from '@inertiajs/vue3'
import Sidebar from './dashboard/Sidebar.vue'
import Toast from './Toast.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  if (window.innerWidth < 640) {
    isSidebarOpen.value = !isSidebarOpen.value
    document.body.style.overflow = isSidebarOpen.value ? 'hidden' : ''
  }
}

const goToHome = () => {
  router.get('/')
}

const logout = () => {
  router.post('/auth/logout')
}

const showActionMenu = ref(false)
const toggleActionMenu = () => {
  showActionMenu.value = !showActionMenu.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    toggleActionMenu()
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

</script>
