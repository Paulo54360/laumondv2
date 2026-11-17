<template>
  <ClientOnly>
    <div v-if="visible" class="curious" :class="{ open }">
      <div v-if="open" class="panel" role="dialog" :aria-label="t('easter_egg.panel_title')">
        <button
          type="button"
          class="panel-close"
          :aria-label="t('easter_egg.close')"
          @click="open = false"
        >
          &times;
        </button>
        <p class="panel-title">{{ t('easter_egg.panel_title') }}</p>
        <p class="panel-text">{{ t('easter_egg.panel_text') }}</p>
        <ul class="steps">
          <li v-for="p in EASTER_EGG.pages" :key="p.path" :class="{ done: read.includes(p.path) }">
            <NuxtLink :to="localePath(p.path)" @click="open = false">
              <span class="check">{{ read.includes(p.path) ? '✓' : '' }}</span>
              {{ t(p.labelKey) }}
            </NuxtLink>
          </li>
        </ul>
        <p v-if="completed" class="secret">
          {{ t('easter_egg.secret_intro') }}
          <strong>« {{ EASTER_EGG.secret }} »</strong>
        </p>
      </div>

      <button
        type="button"
        class="pill"
        :class="{ done: completed }"
        :title="t('easter_egg.panel_title')"
        @click="togglePanel"
      >
        <span class="count">{{ read.length }}/{{ EASTER_EGG.pages.length }}</span>
        <span class="label">{{
          completed ? t('easter_egg.pill_done') : t('easter_egg.pill')
        }}</span>
      </button>
    </div>

    <GalleryEasterEggVideo :show="showVideo" @close="showVideo = false" />
  </ClientOnly>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  import GalleryEasterEggVideo from '~/components/gallery/EasterEggVideo.vue';
  import { EASTER_EGG, normalizePath } from '~/utils/easterEgg';
  import { easterEggVideoOpen } from '~/utils/easterEggState';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute();

  const read = ref<string[]>([]);
  const completed = computed(() => read.value.length >= EASTER_EGG.pages.length);
  const seenIntro = ref(true);
  const open = ref(false);
  const showVideo = easterEggVideoOpen;

  const currentKey = computed(() => normalizePath(route.path));
  const visible = computed(() => !route.path.startsWith('/admin'));

  const save = (): void => {
    localStorage.setItem(
      EASTER_EGG.storageKey,
      JSON.stringify({ read: read.value, seenIntro: seenIntro.value })
    );
  };

  const togglePanel = (): void => {
    open.value = !open.value;
    seenIntro.value = true;
    save();
  };

  const markRead = (): void => {
    const key = currentKey.value;
    if (!EASTER_EGG.pages.some((p) => p.path === key) || read.value.includes(key)) return;
    read.value = [...read.value, key];
    save();
  };

  const checkScroll = (): void => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const progress = scrollable <= 0 ? 1 : (window.scrollY + 0) / scrollable;
    if (progress >= EASTER_EGG.readThreshold) markRead();
  };

  watch(
    () => route.path,
    () => {
      nextTick(checkScroll).catch((): undefined => undefined);
    }
  );

  onMounted(() => {
    try {
      const raw = localStorage.getItem(EASTER_EGG.storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        read.value = Array.isArray(data.read) ? data.read : [];
        seenIntro.value = !!data.seenIntro;
      } else {
        seenIntro.value = false;
      }
    } catch {
      seenIntro.value = false;
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', checkScroll);
  });
</script>

<style lang="scss" scoped>
  .curious {
    position: fixed;
    left: 1.25rem;
    bottom: 1.25rem;
    z-index: 998;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 1.9rem;
    min-width: 1.9rem;
    padding: 0 0.5rem;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid var(--color-muted-light);
    border-radius: 999px;
    color: var(--color-muted);
    font: inherit;
    font-size: 0.7rem;
    cursor: pointer;
    opacity: 0.55;
    transition: all var(--transition-medium);

    &:hover,
    &:focus-visible {
      opacity: 1;
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .count {
      font-weight: var(--font-weight-medium);
    }

    // Le libellé n'apparaît qu'au survol
    .label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      transition: max-width var(--transition-medium);
    }

    &:hover .label,
    &:focus-visible .label {
      max-width: 12rem;
    }

    &.done {
      opacity: 0.8;
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  .panel {
    position: relative;
    width: min(20rem, calc(100vw - 2.5rem));
    background: var(--color-white);
    border-top: 4px solid var(--color-primary);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-md);
  }

  .panel-close {
    position: absolute;
    top: 0.1rem;
    right: 0.4rem;
    background: none;
    border: none;
    font-size: 1.6rem;
    color: var(--color-text);
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }

  .panel-title {
    margin: 0 0 var(--spacing-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
  }

  .panel-text {
    margin: 0 0 var(--spacing-md);
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--color-text-light);
  }

  .steps {
    list-style: none;
    margin: 0;
    padding: 0;

    a {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0;
      color: var(--color-text);
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        color: var(--color-primary);
      }
    }

    .check {
      width: 1.1rem;
      height: 1.1rem;
      border: 1.5px solid var(--color-primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .done {
      a {
        color: var(--color-muted);
      }

      .check {
        background: var(--color-primary);
        color: var(--color-white);
      }
    }
  }

  .secret {
    margin: var(--spacing-md) 0 0;
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--color-border);
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--color-text-light);

    strong {
      display: block;
      margin-top: 0.25rem;
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
    }
  }

  @media (max-width: 768px) {
    .curious {
      left: 0.75rem;
      bottom: 0.75rem;
    }

    .pill .label {
      display: none;
    }
  }
</style>
