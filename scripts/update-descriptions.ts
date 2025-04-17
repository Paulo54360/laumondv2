export interface CategoryTitles {
  [category: string]: {
    [folder: string]: {
      title: string;
      images: Record<string, string>;
    };
  };
}

export const categoryTitles: CategoryTitles = {
  // ... existing code ...
} 