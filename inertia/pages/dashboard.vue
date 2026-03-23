<script setup lang="ts">
import { computed } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'
import Layout from '~/components/admin/Layout.vue'
import PaginatedList from '~/components/admin/PaginatedList.vue'

const page = usePage()
const user = computed(() => page.props.auth.user)
const roles = computed(() => page.props.auth.roles || [])

const isAdmin = computed(() => roles.value.includes('admin'))
const isSeller = computed(() => roles.value.includes('seller'))

// Définition des en-têtes pour les tableaux
const sellerHeaders = [
  { key: 'fullName', label: 'Vendeur' },
  { key: 'companyName', label: 'Entreprise' },
  { key: 'actions', label: 'Actions', textClass: 'text-right' }
]

const orderHeaders = [
  { key: 'customer', label: 'Client' },
  { key: 'product', label: 'Produit' },
  { key: 'amount', label: 'Montant' },
  { key: 'date', label: 'Date', textClass: 'text-right' }
]

const productHeaders = [
  { key: 'product', label: 'Article' },
  { key: 'price', label: 'Prix' },
  { key: 'status', label: 'Statut' },
  { key: 'actions', label: 'Action', textClass: 'text-right' }
]

const props = defineProps<{
  stats: {
    products: number
    orders: number
    pendingSellers?: number
    categories?: number
    brands?: number
    customers?: number
    validatedSellers?: number
    pendingProducts?: number
  }
  recentProducts: any[]
  recentOrders?: any[]
  pendingSellersList?: any[]
}>()

const displayStats = computed(() => {
  const items = [
    { label: 'Articles Totals', value: props.stats.products, icon: 'i-mdi-package-variant', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Commandes', value: props.stats.orders, icon: 'i-mdi-cart-outline', color: 'text-blue-600', bg: 'bg-blue-50' },
  ]
  
  if (isAdmin.value) {
    items.push(
      { label: 'Vendeurs en attente', value: props.stats.pendingSellers || 0, icon: 'i-mdi-account-clock-outline', color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: 'Clients', value: props.stats.customers || 0, icon: 'i-mdi-account-group', color: 'text-cyan-600', bg: 'bg-cyan-50' },
      { label: 'Catégories', value: props.stats.categories || 0, icon: 'i-mdi-folder-outline', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Marques', value: props.stats.brands || 0, icon: 'i-mdi-tag-outline', color: 'text-pink-600', bg: 'bg-pink-50' },
      { label: 'Article en attente', value: props.stats.pendingProducts || 0, icon: 'i-mdi-clock-outline', color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Vendeurs validés', value: props.stats.validatedSellers || 0, icon: 'i-mdi-account-check', color: 'text-green-600', bg: 'bg-green-50' }
    )
  }
  
  return items
})
</script>

<template>
  <Head title="Tableau de Bord" />
  
  <Layout :title="'Tableau de Bord ' + (isAdmin ? 'Admin' : 'Vendeur')">
    <div class="space-y-10">
      <!-- Welcome Section -->
      <section class="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
         <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h3 class="text-3xl font-bold mb-2">Bon retour, {{ user?.fullName }} !</h3>
               <p class="text-slate-400 max-w-md">Voici ce qui se passe sur votre plateforme AB-AUTO aujourd'hui.</p>
               <div v-if="isSeller && user?.registrationNumber" class="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <span class="text-slate-500 uppercase">Matricule:</span>
                  <span class="text-primary font-bold">{{ user.registrationNumber }}</span>
               </div>
            </div>
            
            <div class="flex items-center gap-3">
               <button v-if="isSeller" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                  Nouveau Produit
               </button>
            </div>
         </div>
         
         <!-- Decorative Background Elements -->
         <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
         <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
      </section>

      <!-- Stats Grid -->
      <section :class="isAdmin ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'grid grid-cols-1 md:grid-cols-3 gap-6'">
         <div v-for="stat in displayStats" :key="stat.label" class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center gap-5">
               <div :class="[stat.bg, 'w-14 h-14 rounded-2xl flex items-center justify-center']">
                  <div :class="[stat.icon, stat.color, 'text-2xl']"></div>
               </div>
               <div>
                  <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-black text-slate-800 dark:text-white">{{ stat.value }}</p>
               </div>
            </div>
         </div>
      </section>

      <!-- Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-800 dark:text-white">
         <div class="lg:col-span-2 space-y-8">
            <!-- Pending Sellers List (Admin Only) -->
            <div v-if="isAdmin && pendingSellersList?.length" class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
               <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 class="text-xl font-bold">Inscriptions à valider</h4>
                  <span class="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg">{{ pendingSellersList.length }} nouveaux</span>
               </div>
               
               <PaginatedList
                  :items="pendingSellersList"
                  :headers="sellerHeaders"
                  :items-per-page="5"
                  item-name="vendeurs"
                  empty-message="Aucun vendeur en attente de validation."
               >
                  <template #cell-fullName="{ item }">
                     <div>
                        <p class="font-bold text-sm">{{ item.fullName }}</p>
                        <p class="text-xs text-slate-500">{{ item.email }}</p>
                     </div>
                  </template>
                  <template #cell-actions="{ item }">
                     <div class="text-right space-x-2">
                        <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10">Valider</button>
                        <button class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-xs font-bold rounded-xl transition-all">Rejeter</button>
                     </div>
                  </template>
               </PaginatedList>
            </div>

            <!-- Recent Orders (Admin Only) -->
            <div v-if="isAdmin && recentOrders?.length" class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
               <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 class="text-xl font-bold">Commandes Récentes</h4>
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">{{ recentOrders.length }} commandes</span>
               </div>
               <PaginatedList
                  :items="recentOrders"
                  :headers="orderHeaders"
                  :items-per-page="5"
                  item-name="commandes"
                  empty-message="Aucune commande récente."
               >
                  <template #cell-customer="{ item }">
                     <div>
                        <p class="font-bold text-sm">{{ item.customer?.fullName || 'Client inconnu' }}</p>
                        <p class="text-xs text-slate-500">{{ item.customer?.email || '' }}</p>
                     </div>
                  </template>
                  <template #cell-product="{ item }">
                     <span class="text-sm text-slate-600 dark:text-slate-400">{{ item.product?.name || 'Produit inconnu' }}</span>
                  </template>
                  <template #cell-amount="{ item }">
                     <span class="font-mono font-bold text-sm">{{ (item.quantity * (item.product?.price || 0)).toLocaleString() }} F</span>
                  </template>
                  <template #cell-date="{ item }">
                     <span class="text-xs text-slate-500">
                        {{ new Date(item.createdAt || item.created_at).toLocaleDateString('fr-FR') }}
                     </span>
                  </template>
               </PaginatedList>
            </div>

            <!-- Recent Products -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
               <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 class="text-xl font-bold">{{ isAdmin ? 'Derniers Articles' : 'Mes Articles' }}</h4>
                  <button class="text-primary text-sm font-bold hover:underline">Tout voir</button>
               </div>
               
               <PaginatedList
                  :items="recentProducts"
                  :headers="productHeaders"
                  :items-per-page="5"
                  :item-name="isAdmin ? 'articles' : 'mes articles'"
                  :empty-message="isAdmin ? 'Aucun article ajouté pour le moment.' : 'Vous n\'avez pas encore ajouté d\'article.'"
               >
                  <template #cell-product="{ item }">
                     <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                        <div>
                           <p class="font-bold text-sm">{{ item.name }}</p>
                           <p class="text-[10px] text-slate-500 uppercase">{{ item.category?.name || 'Inconnu' }}</p>
                        </div>
                     </div>
                  </template>
                  <template #cell-price="{ item }">
                     <span class="font-mono font-bold text-sm">{{ item.price }} F</span>
                  </template>
                  <template #cell-status="{ item }">
                     <span class="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Actif</span>
                  </template>
                  <template #cell-actions="{ item }">
                     <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <div class="i-mdi-pencil-outline text-lg text-slate-400"></div>
                     </button>
                  </template>
               </PaginatedList>
            </div>
         </div>

         <!-- Right Column: Quick Stats / Profile Info -->
         <aside class="space-y-8">
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
               <h4 class="text-lg font-bold mb-6">{{ isAdmin ? 'Vue d\'ensemble' : 'Informations' }}</h4>
               <div class="space-y-6">
                  <div v-if="isAdmin" class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-trending-up text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de conversion</p>
                        <p class="text-sm font-bold">{{ Math.round((stats.orders / Math.max(stats.products, 1)) * 100) }}%</p>
                     </div>
                  </div>
                  <div v-if="isAdmin" class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-account-multiple text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total vendeurs</p>
                        <p class="text-sm font-bold">{{ (stats.validatedSellers || 0) + (stats.pendingSellers || 0) }}</p>
                     </div>
                  </div>
                  <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-map-marker text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</p>
                        <p class="text-sm font-bold">{{ user?.city || 'Ouagadougou' }}, {{ user?.neighborhood || 'Burkina Faso' }}</p>
                     </div>
                  </div>
                  <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-building text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entreprise</p>
                        <p class="text-sm font-bold">{{ user?.companyName || (isAdmin ? 'AB-AUTO Admin' : 'Individuel') }}</p>
                     </div>
                  </div>
                  <div v-if="isAdmin" class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-calendar text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Système actif</p>
                        <p class="text-sm font-bold">{{ Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) }} jours</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- Quick Help -->
            <div class="p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
               <p class="text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest text-center">Besoin d'aide ?</p>
               <button class="w-full bg-white/5 hover:bg-white/10 text-white text-sm py-3 rounded-2xl transition border border-white/5 font-bold">
                  Support Technique
               </button>
            </div>
         </aside>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}
</style>
