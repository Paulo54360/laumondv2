<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  import { useHead } from 'nuxt/app';

  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
      },
    ],
  });
</script>
