/**
 * Setup Vitest : fournit les auto-imports Vue/Nuxt pour les tests de pages.
 * Les pages utilisent ref, useSearch, useI18n, etc. sans import (Nuxt) ; en test ils doivent être globaux.
 */
import {
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  provide,
  inject,
  h,
} from 'vue';

// Vue reactivity (auto-importés par Nuxt dans les pages)
globalThis.ref = ref;
globalThis.computed = computed;
globalThis.reactive = reactive;
globalThis.watch = watch;
globalThis.onMounted = onMounted;
globalThis.onUnmounted = onUnmounted;
globalThis.onBeforeUnmount = onBeforeUnmount;
globalThis.provide = provide;
globalThis.inject = inject;
globalThis.h = h;

// Nuxt macros / composables par défaut (les specs peuvent surcharger)
globalThis.definePageMeta = vi.fn();

globalThis.useSearch = (): { searchArtworks: (q: string) => Promise<unknown[]> } => ({
  searchArtworks: vi.fn().mockResolvedValue([]),
});

globalThis.useImageProxy = (): ((url: string | undefined | null) => string) => {
  return (url: string | undefined | null): string => url ?? '';
};

globalThis.useRoute = (): { path: string; query: Record<string, string> } => ({
  path: '/fr',
  query: {},
});

globalThis.useI18n = (): { t: (key: string) => string; locale: ReturnType<typeof ref> } => ({
  t: (key: string): string => key,
  locale: ref('fr'),
});
