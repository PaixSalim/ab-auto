<script setup lang="ts">
import BannerSlider from '~/components/BannerSlider.vue'
import ProductCategories from '~/components/ProductCategories.vue'
import MobileNavbar from '~/components/MobileNavbar.vue'
import DealGrid from '~/components/DealGrid.vue'
import DesktopNavbar from '~/components/DesktopNavbar.vue'
import PopularBrands from '~/components/PopularBrands.vue'
import AllProductsGrid from '~/components/AllProductsGrid.vue'
import Notification from '~/components/Notification.vue'
import { Head } from '@inertiajs/vue3'
import SupportAssistant from '~/components/SupportAssistant.vue'
import { BannerInterface } from '#dto/banners_interface'
import { PartnerInterface } from '#dto/partners_interface'
import { GetProductDto } from '#dto/products_interface'
import { CategoryDto } from '#dto/category_dto'

defineProps<{
  banners: BannerInterface[]
  partners: PartnerInterface[]
  products: GetProductDto[]
  categories: CategoryDto[]
}>()
const interval: number = 5000
const autoplay: boolean = true

</script>
<template>

  <Head>
    <title>Accueil</title>
  </Head>
  <div class="min-h-screen bg-gray-50">
    <Notification />
    <DesktopNavbar/>

    <MobileNavbar/>

    <main class="container mx-auto px-4 py-6">
      <BannerSlider :banners="banners" :interval="interval" :autoplay="autoplay"/>

      <ProductCategories />

      <PopularBrands :partners="partners"/>

      <DealGrid/>

      <AllProductsGrid :products="products" :categories="categories" />

      <SupportAssistant />
    </main>
  </div>
</template>


<style>

</style>
