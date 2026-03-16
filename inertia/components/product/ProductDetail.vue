<template>
  <div class="min-h-screen">
    <div class="container mx-auto py-6">
      <!-- Fil d'Ariane -->
      <div class="text-sm px-4 text-text-secondary mb-4">
        <span @click="router.get('/')" class="hover:text-primary cursor-pointer">Accueil</span> &gt;
        <span class="">{{ product.category.name }}</span> &gt;
        <span @click="router.get('/catalogue')" class="hover:text-primary cursor-pointer"
          >Catalogue &gt;
        </span>
      </div>

      <div class="bg-gray-100 rounded-lg shadow-sm overflow-hidden p-4 md:p-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-2/5">
            <div class="relative mb-4 rounded-lg overflow-hidden">
              <div>
                <!-- Video -->
                <div v-if="selectedMedia && selectedMedia.type === MediaType.VIDEO" class="aspect-video w-full">
                  <iframe
                    :src="getYouTubeEmbedUrl(selectedMedia.url)"
                    class="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <!-- Image -->
                <div v-else-if="selectedMedia" @click="showLightbox(selectedMediaIndex)" class="relative group">
                  <img
                    :src="selectedMedia.url"
                    :alt="`${product.name} - Vue`"
                    class="w-full h-70 object-contain bg-gray-200 cursor-zoom-in"
                  />
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="bg-black bg-opacity-50 rounded-full p-2">
                      <div class="i-mdi-magnify text-2xl text-white"></div>
                    </div>
                  </div>
                </div>
              </div>
              <span
                v-if="product.discount"
                class="absolute top-4 left-4 bg-state-error text-white px-3 py-1 rounded-md"
              >
      </span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              <div
                v-for="(media, index) in product.medias"
                @click="selectedMedia = media"
                :key="index"
                class="cursor-pointer rounded-md overflow-hidden border-2 transition-all"
                :class="selectedMedia === media ? 'border-primary' : 'border-transparent'"
              >
                <div v-if="media.type === MediaType.VIDEO" class="aspect-video w-full">
                  <div class="w-full h-full bg-#2a2b36 flex items-center justify-center">
                    <div class="i-mdi-play text-2xl text-primary"></div>
                  </div>
                </div>
                <img
                  v-else
                  :src="media.url"
                  :alt="`${product.name} - Vue ${index + 1}`"
                  class="w-full aspect-video object-cover rounded-xl"
                />
              </div>
            </div>

            <!-- Vue Easy Lightbox -->
            <vue-easy-lightbox
              :visible="lightboxVisible"
              :imgs="lightboxImages"
              :index="lightboxIndex"
              @hide="lightboxVisible = false"
              :moveDisabled="false"
              :enableZoom="true"
              :zoomScale="3"
            >
              <template v-slot:toolbar="{ toolbarMethods }">
                <div class="toolbar-custom">
                  <button @click="toolbarMethods.zoomIn" class="toolbar-btn">
                    <div class="i-mdi-plus text-xl text-white"></div>
                  </button>
                  <button @click="toolbarMethods.zoomOut" class="toolbar-btn">
                    <div class="i-mdi-minus text-xl text-white"></div>
                  </button>
                  <button @click="toolbarMethods.rotate" class="toolbar-btn">
                    <div class="i-mdi-rotate-right text-xl text-white"></div>
                  </button>
                  <button @click="lightboxVisible = false" class="toolbar-btn">
                    <div class="i-mdi-close text-xl text-white"></div>
                  </button>
                </div>
              </template>
            </vue-easy-lightbox>
          </div>

          <div class="lg:w-3/5">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-xl md:text-3xl font-bold text-text-title mb-2">
                  {{ product.name }}
                </h1>
              </div>
            </div>

            <div class="mb-6">
              <div v-if="product.cta === ''" class="flex items-center gap-3 mb-2">
                <span  class="text-xl text-primary md:text-3xl font-bold"
                  >{{ formatPrice(getRealPrice(product.price, product.discount)) }} Fcfa</span
                >
                <span
                  v-if="product.discount > 0"
                  class="text-sm font-medium border text-primary border-primary rounded-full px-1 text-gray-500"
                >
                  Prix promo
                </span>
              </div>
              <div v-else>
                <span  class="text-xl text-primary md:text-3xl font-bold"
                >{{ product.cta }}</span
                >
              </div>
            </div>

            <!-- Sélection de l'état -->
            <div class="mb-6">
              <h3 class="font-medium text-text-title mb-3">État du produit</h3>
              <div class="flex gap-3">
                <button
                  @click="selectedCondition = 'new'"
                  class="px-4 py-2 rounded-md border transition-colors"
                  :class="
                    selectedCondition === 'new'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-body border-background-tertiary'
                  "
                >
                  Neuf
                  <span v-if="selectedCondition === 'new'" class="ml-2"></span>
                </button>
                <button
                  @click="selectedCondition = 'used'"
                  class="px-4 py-2 rounded-md border transition-colors"
                  :class="
                    selectedCondition === 'used'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text-body border-background-tertiary'
                  "
                >
                  Occasion
                  <span v-if="selectedCondition === 'used'" class="ml-2">(Prix variable)</span>
                </button>
              </div>
            </div>

            <!-- Quantité -->
            <div class="mb-6">
              <h3 class="font-medium text-text-title mb-3">Quantité</h3>
              <div class="flex items-center">
                <button
                  @click="quantity > 1 && quantity--"
                  class="w-10 h-10 flex items-center justify-center border border-background-tertiary rounded-l-md"
                  :disabled="quantity <= 1"
                  :class="{ 'opacity-50': quantity <= 1 }"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                <input
                  type="number"
                  v-model.number="quantity"
                  min="1"
                  class="w-16 h-10 border-y border-background-tertiary text-center"
                />
                <button
                  @click="quantity < 100 && quantity++"
                  class="w-10 h-10 flex items-center justify-center border border-background-tertiary rounded-r-md"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                @click="addToCart"
                class="flex-1 py-3 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <div class="i-mdi-cart-outline w-5 h-5" />
                Lancer la commande
              </button>
              <button
                @click="callCommercial"
                class="flex gap-2 justify-center items-center py-3 px-4 border border-primary text-primary hover:bg-primary-light rounded-md transition-colors"
              >
                <div class="i-line-md-phone-call-loop w-5 h-5" />
                Contacter le vendeur
              </button>

              <button
                @click="sharePage"
                class="flex items-center justify-center gap-2 py-3 px-4 border border-background-tertiary text-text-secondary hover:text-primary rounded-md transition-colors"
              >
                <div class="i-mdi-ios-share w-5 h-5" />
                Partager
              </button>
            </div>

            <!-- Informations supplémentaires -->
            <div class="border-t border-background-tertiary pt-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-text-secondary mb-1">Marque</p>
                  <p class="font-medium">{{ product.brand.name }}</p>
                </div>
                <div>
                  <p class="text-text-secondary mb-1">Catégorie</p>
                  <p class="font-medium">{{ product.category.name }}</p>
                </div>
                <div>
                  <p class="text-text-secondary mb-1">Livraison estimée</p>
                  <p class="font-medium">3-7 jours ouvrés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="border-b border-background-tertiary">
          <div class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-6 py-3 font-medium whitespace-nowrap"
              :class="
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-body'
              "
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <div class="py-6">
          <!-- Description -->
          <div v-if="activeTab === 'description'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-text-title mb-4">Description du produit</h2>
            <div class="prose text-text-body">
              <p>{{ product.description }}</p>
              <h3 class="text-lg font-medium text-text-title mt-6 mb-3">Caractéristiques</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li v-for="(feature, index) in product.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'shipping'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-text-title mb-4">Informations de livraison</h2>
            <div class="space-y-6">
              <div class="flex items-start gap-4 p-4 border border-background-tertiary rounded-lg">
                <TruckIcon class="w-8 h-8 text-primary" />
                <div>
                  <h3 class="font-medium text-text-title mb-1">Livraison standard</h3>
                  <p class="text-text-body mb-2">Livraison en 3-7 jours ouvrables</p>
                </div>
              </div>

              <div class="flex items-start gap-4 p-4 border border-background-tertiary rounded-lg">
                <StoreIcon class="w-8 h-8 text-primary" />
                <div>
                  <h3 class="font-medium text-text-title mb-1">Retrait en magasin</h3>
                  <p class="text-text-body mb-2">Disponible sous 2h dans nos magasins</p>
                  <p class="text-text-secondary text-sm">Gratuit</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'seller'" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-text-title mb-4">Informations du vendeur</h2>
            <div v-if="product.seller" class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {{ product.seller.fullName?.charAt(0).toUpperCase() || 'V' }}
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-text-title text-lg">{{ product.seller.fullName || 'Vendeur' }}</h3>
                  <p class="text-text-secondary text-sm">Vendeur vérifié</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="i-mdi-phone w-5 h-5 text-primary"></div>
                  <div>
                    <p class="text-sm text-text-secondary">Téléphone</p>
                    <p class="font-medium">{{ product.seller.phone || 'Non disponible' }}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="i-mdi-email w-5 h-5 text-primary"></div>
                  <div>
                    <p class="text-sm text-text-secondary">Email</p>
                    <p class="font-medium text-sm">{{ product.seller.email }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div class="i-mdi-map-marker w-5 h-5 text-primary"></div>
                  <div>
                    <p class="text-sm text-text-secondary">Ville</p>
                    <p class="font-medium">{{ product.seller.city || 'Non spécifiée' }}</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center gap-2 mb-2">
                  <div class="i-mdi-shield-check w-5 h-5 text-blue-600"></div>
                  <h4 class="font-medium text-blue-900">Vendeur de confiance</h4>
                </div>
                <p class="text-sm text-blue-800">
                  Ce vendeur a été vérifié par notre équipe. Vous pouvez contacter directement le vendeur pour plus d'informations sur ce produit.
                </p>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              <div class="i-mdi-store w-12 h-12 text-gray-400 mx-auto mb-3"></div>
              <p class="text-text-secondary">Les informations du vendeur ne sont pas disponibles</p>
            </div>
          </div>
        </div>
      </div>

      <OrderModal
        v-model="showOrderModal"
        :product="product"
        :quantity="quantity"
        :selected-condition="selectedCondition"
        @order-submitted="handleOrderSubmitted"
      />

      <OrderSuccessToast
        :show="showOrderConfirmation"
        title="Félicitations "
        message="Commande passée avec succès"
      />

      <OrderSuccessToast
        :show="showCopyLink"
        @close="showCopyLink = false"
        title="Lien copié "
        message="Le lien du produit a été copié dans le presse papier"
      />

      <SimilarProducts :similar-products="similarProducts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MinusIcon, PlusIcon, StoreIcon, TruckIcon } from 'lucide-vue-next'
import SimilarProducts from '~/components/product/sections/SimilarProducts.vue'
import { router } from '@inertiajs/vue3'
import OrderModal from '~/components/product/OrderModal.vue'
import OrderSuccessToast from '~/components/order/OrderSuccessToast.vue'
import { GetProductDto, MediaDto, MediaType } from '#dto/products_interface'
import { getRealPrice } from '~/composables/use_price'
import { formatPrice } from '~/composables/format_price'
import { getYouTubeEmbedUrl } from '~/composables/get_youtube_embed'
import VueEasyLightbox from 'vue-easy-lightbox';
const props = defineProps<{
  product: GetProductDto
  similarProducts: GetProductDto[]
}>()
const selectedMedia = ref<MediaDto | null>(props.product.medias?.[0] || null)
const selectedCondition = ref('new')
const quantity = ref(1)
const activeTab = ref('description')

const tabs = [
  { id: 'description', name: 'Description' },
  { id: 'shipping', name: 'Livraison' },
  { id: 'seller', name: 'Vendeur' },
]

const showOrderModal = ref(false)
const showOrderConfirmation = ref(false)
const showCopyLink = ref(false)

const handleOrderSubmitted = () => {
  showOrderConfirmation.value = true

  setTimeout(() => {
    showOrderConfirmation.value = false
  }, 1000)
}

const addToCart = () => {
  showOrderModal.value = true
}

const callCommercial = () => {
  // Utiliser le téléphone du vendeur, ou fallback sur le contact par défaut
  const sellerPhone = props.product.seller?.phone
  const defaultPhone = '22607513333'
  const phone = sellerPhone || defaultPhone
  
  window.location.href = `https://api.whatsapp.com/send?phone=${phone}`
}

const sharePage = async () => {
  const currentUrl = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: currentUrl,
      })
      showCopyLink.value = true
      setTimeout(() => {
        showCopyLink.value = false
      }, 3000)
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl)
        showCopyLink.value = true
        setTimeout(() => {
          showCopyLink.value = false
        }, 3000)
      } catch (err) {
        console.error('Failed to copy text: ', err)
      }
    } else {
      // Solution de secours : utilise un champ caché pour copier manuellement l'URL
      const textarea = document.createElement('textarea')
      textarea.value = currentUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showCopyLink.value = true
      setTimeout(() => {
        showCopyLink.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Partage échoué', error)
  }
}

// Pour le zoom
// Variables pour le lightbox
const lightboxVisible = ref(false);
const lightboxIndex = ref(0);

// Filtrer uniquement les images pour le lightbox
const lightboxImages = computed(() => {
  return props.product.medias
    .filter(media => media.type !== MediaType.VIDEO)
    .map(media => ({
      src: media.url,
      title: props.product.name
    }));
});

// Index de l'image sélectionnée dans le tableau filtré
const selectedMediaIndex = computed(() => {
  if (!selectedMedia.value || selectedMedia.value.type === MediaType.VIDEO) return 0;
  return props.product.medias
    .filter(media => media.type !== MediaType.VIDEO)
    .findIndex(media => selectedMedia.value && media.url === selectedMedia.value.url);
});

// Afficher le lightbox
const showLightbox = (index: number) => {
  lightboxIndex.value = index >= 0 ? index : 0;
  lightboxVisible.value = true;
};

const debugClick = () => {
  console.log('Image clicked');
  console.log('Selected media:', selectedMedia.value);
  if (selectedMedia.value) {
    console.log('Media type:', selectedMedia.value.type);
    console.log('Is video?', selectedMedia.value.type === MediaType.VIDEO);
  }
  console.log('Lightbox images:', lightboxImages.value);
  console.log('Selected media index:', selectedMediaIndex.value);

  // Tenter d'ouvrir le lightbox
  if (selectedMediaIndex.value >= 0) {
    lightboxIndex.value = selectedMediaIndex.value;
    lightboxVisible.value = true;
  }
  console.log('Lightbox visible set to:', lightboxVisible.value);
};
</script>
<style scoped>
.toolbar-custom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.toolbar-btn {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
