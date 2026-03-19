<script setup lang="ts">
import { computed } from 'vue'
import { usePage, Head } from '@inertiajs/vue3'
import Layout from '~/components/admin/Layout.vue'

const page = usePage()
const user = computed(() => page.props.auth.user)
const roles = computed(() => page.props.auth.roles || [])

const isAdmin = computed(() => roles.value.includes('admin'))
const isSeller = computed(() => roles.value.includes('seller'))

const props = defineProps<{
  stats: {
    products: number
    orders: number
    pendingSellers?: number
    revenue?: string
  }
  recentProducts: any[]
  pendingSellersList?: any[]
}>()

const displayStats = computed(() => {
  const items = [
    { label: 'Articles', value: props.stats.products, icon: 'i-mdi-package-variant', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Commandes', value: props.stats.orders, icon: 'i-mdi-cart-outline', color: 'text-blue-600', bg: 'bg-blue-50' },
  ]
  
  if (isAdmin.value) {
    items.push({ label: 'Vendeurs en attente', value: props.stats.pendingSellers || 0, icon: 'i-mdi-account-clock-outline', color: 'text-orange-600', bg: 'bg-orange-50' })
  } else {
    items.push({ label: 'Chiffre d\'affaires', value: props.stats.revenue || '0 F', icon: 'i-mdi-currency-usd', color: 'text-emerald-600', bg: 'bg-emerald-50' })
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
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
               <div class="overflow-x-auto">
                  <table class="w-full text-left">
                     <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <tr>
                           <th class="px-8 py-4">Vendeur</th>
                           <th class="px-8 py-4">Entreprise</th>
                           <th class="px-8 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr v-for="seller in pendingSellersList" :key="seller.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                           <td class="px-8 py-5">
                              <p class="font-bold text-sm">{{ seller.fullName }}</p>
                              <p class="text-xs text-slate-500">{{ seller.email }}</p>
                           </td>
                           <td class="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">{{ seller.companyName }}</td>
                           <td class="px-8 py-5 text-right space-x-2">
                              <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10">Valider</button>
                              <button class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-xs font-bold rounded-xl transition-all">Rejeter</button>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <!-- Recent Products -->
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
               <div class="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h4 class="text-xl font-bold">{{ isAdmin ? 'Derniers Articles' : 'Mes Articles' }}</h4>
                  <button class="text-primary text-sm font-bold hover:underline">Tout voir</button>
               </div>
               <div class="overflow-x-auto">
                  <table class="w-full text-left">
                     <thead class="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <tr>
                           <th class="px-8 py-4">Article</th>
                           <th class="px-8 py-4">Prix</th>
                           <th class="px-8 py-4">Statut</th>
                           <th class="px-8 py-4 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr v-for="product in recentProducts" :key="product.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                           <td class="px-8 py-5 flex items-center gap-4">
                              <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                              <div>
                                 <p class="font-bold text-sm">{{ product.name }}</p>
                                 <p class="text-[10px] text-slate-500 uppercase">{{ product.category?.name || 'Inconnu' }}</p>
                              </div>
                           </td>
                           <td class="px-8 py-5 font-mono font-bold text-sm">{{ product.price }} F</td>
                           <td class="px-8 py-5">
                              <span class="px-2 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">Actif</span>
                           </td>
                           <td class="px-8 py-5 text-right">
                              <button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                 <div class="i-mdi-pencil-outline text-lg text-slate-400"></div>
                              </button>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <!-- Right Column: Quick Stats / Profile Info -->
         <aside class="space-y-8">
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
               <h4 class="text-lg font-bold mb-6">Informations</h4>
               <div class="space-y-6">
                  <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-map-marker text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</p>
                        <p class="text-sm font-bold">{{ user?.city || 'Douala' }}, {{ user?.neighborhood || 'Cameroun' }}</p>
                     </div>
                  </div>
                  <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <div class="i-mdi-building text-slate-400"></div>
                     </div>
                     <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entreprise</p>
                        <p class="text-sm font-bold">{{ user?.companyName || 'Individuel' }}</p>
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
         </aside>Section Stats Section Section Section Section Stat Cards Row Stats Row Stats Section Section
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
