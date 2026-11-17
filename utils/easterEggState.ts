import { ref } from 'vue';

/** État partagé : vidéo de l'easter egg affichée ou non (modifié côté client uniquement) */
export const easterEggVideoOpen = ref(false);
