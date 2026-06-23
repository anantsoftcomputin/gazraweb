export const DEFAULT_CAFE_CATEGORIES = [
  { slug: 'pine-mein', name: 'Pine Mein', order: 1 },
  { slug: 'nashte-mein', name: 'Nashte Mein', order: 2 },
  { slug: 'khane-mein', name: 'Khane Mein', order: 3 },
  { slug: 'meetha', name: 'Meetha', order: 4 },
  { slug: 'extra-item', name: 'Extra Item', order: 5 },
  { slug: 'sugras-product', name: 'Sugras Product', order: 6 },
  { slug: 'gazra-ki-dukan', name: 'Gazra Ki Dukan', order: 7 }
];

export const LEGACY_CAFE_CATEGORY_MAP = {
  starters: 'nashte-mein',
  mains: 'khane-mein',
  beverages: 'pine-mein'
};

export const normalizeCafeCategoryId = (categoryId) => (
  LEGACY_CAFE_CATEGORY_MAP[categoryId] || categoryId
);

export const createCafeCategorySlug = (name) => name
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const sortCafeCategories = (categories) => [...categories].sort((a, b) => {
  const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 999;
  const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 999;
  if (orderA !== orderB) return orderA - orderB;
  return (a.name || '').localeCompare(b.name || '');
});
