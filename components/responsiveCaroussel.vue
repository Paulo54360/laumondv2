<template>
  <div class="carousel">
    <swiper
        :slides-per-view="1"
        :breakpoints="{
        412: { slidesPerView: 1 },
        620: { slidesPerView: 2 },
        820: { slidesPerView: 3 },
        1440: { slidesPerView: 4 },
      }"
        navigation
    >
      <swiper-slide v-for="(image, index) in images" :key="index">
        <NuxtImg :src="image" alt="Oeuvre" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import {Swiper, SwiperSlide} from 'swiper/vue';

defineProps({
  images: Array
});
</script>

<style>
.carousel {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
