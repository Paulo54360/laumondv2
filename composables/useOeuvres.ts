export default function useOeuvres() {
  const config = useRuntimeConfig();

  const imageUrlsArchetypes = ref<string[]>([]);
  const imageUrlsDeployments = ref<string[]>([]);
  const imageUrlsDrawings = ref<string[]>([]);
  const imageUrlsTranscriptions = ref<string[]>([]);

  for (let i = 1; i <= 4; i++) {
    const num = i.toString().padStart(2, '0');
    imageUrlsArchetypes.value.push(`${config.public.apiUrl}/Archetypes/03/${num}.jpg`);
    imageUrlsDeployments.value.push(`${config.public.apiUrl}/Deployments/00/${num}.jpg`);
    imageUrlsDrawings.value.push(`${config.public.apiUrl}/Drawings+/01/${num}.jpg`);
    imageUrlsTranscriptions.value.push(`${config.public.apiUrl}/Transcriptions/02/${num}.jpg`);
  }

  return {
    imageUrlsArchetypes,
    imageUrlsDeployments,
    imageUrlsDrawings,
    imageUrlsTranscriptions,
  };
}
