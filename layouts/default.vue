<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
  import TheFooter from '~/components/layout/TheFooter.vue';
  import Navbar from '~/components/navbar.vue';
  // Layout par défaut avec Navbar + Footer
</script>

<style lang="scss">
  :root {
    --header-height: 80px;
    --max-width-content: 1200px;
    --color-background: #ffffff;
    --color-background-alt: #f8f9fa;
    --color-text: #2c3e50;
    --color-text-light: #6c757d;
    --color-primary: #cc0000;
  }

  .app-layout {
    min-height: 100vh;

    .main-content {
      padding-top: var(--header-height);
    }
  }

  // Styles globaux
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-background);
  }

  // Responsive breakpoints
  @media (max-width: 768px) {
    :root {
      --header-height: auto;
      --max-width-content: 100%;
    }

    .app-layout .main-content {
      padding-top: 0;
    }
  }

  @media (max-width: 480px) {
    :root {
      --header-height: auto;
    }
  }
</style>
