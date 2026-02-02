<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  import { useHead } from 'nuxt/app';

  useHead({
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
      },
      {
        property: 'og:image',
        content: [
          'https://plaumondpicture.s3.eu-west-3.amazonaws.com/authors/',
          'Work+of+Identity+from+ID+Laumond.jpg',
        ].join(''),
      },
      {
        name: 'twitter:image',
        content: [
          'https://plaumondpicture.s3.eu-west-3.amazonaws.com/authors/',
          'Work+of+Identity+from+ID+Laumond.jpg',
        ].join(''),
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
      },
    ],
  });
</script>
