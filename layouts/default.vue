<template>
  <div class="app-layout">
    <navbar />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Le layout par défaut qui inclut la navbar
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-background);
}

// Responsive breakpoints
@media (max-width: 768px) {
  :root {
    --header-height: 70px;
  }
}

@media (max-width: 480px) {
  :root {
    --header-height: 60px;
  }
}
</style>
