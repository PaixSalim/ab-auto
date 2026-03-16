<template>
  <Layout>
    <PromotionManager :promos="promos" />
  </Layout>
</template>

<script setup lang="ts">
import Layout from '~/components/admin/Layout.vue'
import PromotionManager from '~/components/admin/promotions/PromotionManager.vue'
import type Promotion from '#models/promotion'
import { usePoll } from '@inertiajs/vue3'
defineProps<{
  promos: Promotion[]
}>()

usePoll(1000)
</script>
