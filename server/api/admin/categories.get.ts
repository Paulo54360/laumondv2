// Handler API admin pour les catégories

type CategoryRow = {
  id: number;
  name: string;
  path: string | null;
};

export default defineEventHandler(async (event) => {
  await requireAdminUser(event);

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, path')
    .order('name', { ascending: true });

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Erreur chargement catégories' });
  }

  return { categories: (data ?? []) as CategoryRow[] };
});
