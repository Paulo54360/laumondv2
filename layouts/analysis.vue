<template>
  <div class="layout-analysis">
    <TheHeader />
    
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.layout-analysis {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  main {
    flex: 1;
    max-width: var(--max-width-content);
    margin: 0 auto;
    width: 100%;
  }
}
</style> 