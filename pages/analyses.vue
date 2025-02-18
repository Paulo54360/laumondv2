<template>
  <div>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: activeTab === tab.name }"
        @click="activeTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tab-content">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Tab1Content from '@/components/Tab1Content.vue';
import Tab2Content from '@/components/Tab2Content.vue';
import Tab3Content from '@/components/Tab3Content.vue';
import Tab4Content from '@/components/Tab4Content.vue';

const { t } = useI18n();

const tabs = [
  { name: 'Tab4', label: 'Le portant', component: Tab4Content },
  { name: 'Tab2', label: 'Concordance universelle', component: Tab2Content },
  { name: 'Tab1', label: 'Comme deux aimants', component: Tab1Content },
  { name: 'Tab3', label: 'Afin qu’un jour advienne', component: Tab3Content },
 
];

const activeTab = ref(tabs[0].name);

const activeTabComponent = computed(() => {
  const tab = tabs.find(t => t.name === activeTab.value);
  return tab?.component;
});
</script>

<style scoped>
.tabs {
  display: flex;
  cursor: pointer;
}

button {
  padding: 10px;
  border: none;
  background: none;
  transition: background 0.3s;
}

button.active {
  background: #cccccc00;
  font-weight: bold;
}
button:hover {
  text-decoration: underline;
  text-decoration-color:#cc0000;
}

.tab-content {
  margin-top: 20px;
}
</style>