import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChefHat, Flame, Heart, Image as ImageIcon, Search, Sparkles, Utensils, X } from 'lucide-react';
import { useFirestore } from '../../hooks/useFirestore';
import {
  DEFAULT_CAFE_CATEGORIES,
  normalizeCafeCategoryId,
  sortCafeCategories
} from '../../constants/cafeCategories';

const fallbackDishImage = '/images/food-image.webp';

const MenuCard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CAFE_CATEGORIES);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryPinned, setIsCategoryPinned] = useState(false);
  const categoryControlsRef = useRef(null);

  const { getDocuments: getMenuItems } = useFirestore('menuItems');
  const { getDocuments: getCafeCategories } = useFirestore('cafeCategories');

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const [categoryResult, menuResult] = await Promise.all([
          getCafeCategories(),
          getMenuItems()
        ]);

        const activeCategories = categoryResult.success && categoryResult.data.length > 0
          ? sortCafeCategories(categoryResult.data)
          : DEFAULT_CAFE_CATEGORIES;

        const availableItems = menuResult.success
          ? menuResult.data
            .filter((item) => item.available !== false)
            .map((item) => ({ ...item, category: normalizeCafeCategoryId(item.category) }))
            .sort((a, b) => {
              const orderA = Number.isFinite(Number(a.order)) ? Number(a.order) : 999;
              const orderB = Number.isFinite(Number(b.order)) ? Number(b.order) : 999;
              if (orderA !== orderB) return orderA - orderB;
              return (a.name || '').localeCompare(b.name || '');
            })
          : [];

        setCategories(activeCategories);
        setMenuItems(availableItems);
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const updatePinnedState = () => {
      const isMobile = window.innerWidth < 640;
      const triggerY = (categoryControlsRef.current?.offsetTop || 0) - 128;
      setIsCategoryPinned(isMobile && window.scrollY > triggerY);
    };

    updatePinnedState();
    window.addEventListener('scroll', updatePinnedState, { passive: true });
    window.addEventListener('resize', updatePinnedState);
    return () => {
      window.removeEventListener('scroll', updatePinnedState);
      window.removeEventListener('resize', updatePinnedState);
    };
  }, []);

  const categoryTabs = useMemo(() => ([
    { slug: 'all', name: 'All' },
    ...categories
  ]), [categories]);

  const categoryNameBySlug = useMemo(() => (
    categories.reduce((acc, category) => {
      acc[category.slug] = category.name;
      return acc;
    }, {})
  ), [categories]);

  const itemCountByCategory = useMemo(() => (
    menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, { all: 0 })
  ), [menuItems]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!query) return true;
      return `${item.name || ''} ${item.description || ''}`.toLowerCase().includes(query);
    });
  }, [menuItems, searchQuery, selectedCategory]);

  const groupedItems = useMemo(() => (
    categories
      .map((category) => ({
        ...category,
        items: filteredItems.filter((item) => item.category === category.slug)
      }))
      .filter((category) => category.items.length > 0)
  ), [categories, filteredItems]);

  const getDishImage = (item) => {
    const image = (item.images || []).find(Boolean) || item.image;
    return image || fallbackDishImage;
  };

  return (
    <div className="min-h-screen bg-[var(--gazra-paper)]">
      <section className="relative overflow-hidden bg-primary-700 text-white">
        <img
          src="/images/food-image.webp"
          alt="Gazra Cafe food"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-800/72 to-primary-900/88" />
        <div className="relative container mx-auto px-4 pb-8 pt-12 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur">
              <ChefHat className="h-4 w-4" />
              Gazra Cafe Menu
            </div>
            <h1 className="mt-4 font-display text-3xl font-black leading-tight text-white sm:mt-5 sm:text-5xl">
              Gujarati and Maharashtrian comfort, served with heart
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base">
              Browse the latest cafe menu from Pine Mein to Gazra Ki Dukan. Photos can be added from admin whenever you are ready.
            </p>
            <div className="mt-5 inline-flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <Utensils className="h-5 w-5 text-primary-100" />
              <span className="font-bold">{itemCountByCategory.all || 64} dishes</span>
              <span className="h-4 w-px bg-white/25" />
              <span className="text-white/80">{categories.length} categories</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div
          ref={categoryControlsRef}
          className={`${isCategoryPinned ? 'fixed left-0 right-0 top-[128px] z-40 mx-0 border-y border-[rgba(184,121,44,0.22)]' : 'relative -mx-4 mb-6 border-b border-[rgba(184,121,44,0.18)]'} bg-[rgba(251,244,231,0.96)] px-4 py-3 shadow-sm backdrop-blur-xl sm:relative sm:left-auto sm:right-auto sm:top-auto sm:z-auto sm:mx-0 sm:mb-8 sm:rounded-lg sm:border sm:shadow-md lg:flex lg:items-center lg:justify-between lg:gap-4`}
        >
          <div className="relative mb-3 flex-1 lg:mb-0 lg:max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search dishes, drinks, desserts..."
              className="h-12 w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden">
            {categoryTabs.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`inline-flex min-w-fit snap-start items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category.slug
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300'
                }`}
              >
                <span>{category.name}</span>
                <span className={`rounded px-1.5 py-0.5 text-[11px] ${
                  selectedCategory === category.slug ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'
                }`}>
                  {itemCountByCategory[category.slug] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
        {isCategoryPinned && <div className="h-[116px] sm:hidden" />}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
            <Utensils className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
            <h2 className="text-xl font-bold text-neutral-900">No dishes found</h2>
            <p className="mt-2 text-neutral-600">Try another category or search term.</p>
          </div>
        ) : (
          <div className="space-y-9 sm:space-y-12">
            {groupedItems.map((category) => (
              <div key={category.slug}>
                <div className="mb-4 flex items-center justify-between gap-4 border-b border-[rgba(184,121,44,0.25)] pb-3 sm:mb-5">
                  <div>
                    <h2 className="font-display text-xl font-black text-neutral-900 sm:text-2xl">{category.name}</h2>
                    <p className="text-sm text-neutral-500">{category.items.length} item{category.items.length === 1 ? '' : 's'}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.items.map((item, index) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: (index % 4) * 0.05 }}
                      onClick={() => setSelectedItem(item)}
                      className="heritage-paper group relative flex h-full cursor-pointer overflow-hidden rounded-lg border-2 border-[rgba(184,121,44,0.55)] text-left shadow-sm transition hover:-translate-y-1 hover:border-primary-400 hover:shadow-lg sm:flex-col"
                    >
                      <div className="heritage-rule absolute left-0 top-0 z-10 h-1.5 w-full" />
                      <div className="relative h-auto min-h-[172px] w-36 shrink-0 overflow-hidden bg-[#fff8ec] sm:h-56 sm:w-full">
                        <img
                          src={getDishImage(item)}
                          alt={item.name}
                          className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src = fallbackDishImage;
                          }}
                        />
                        {!item.image && (!item.images || item.images.length === 0) && (
                          <div className="absolute bottom-2 right-2 rounded bg-white/90 p-1.5 text-primary-600">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                        <div className="absolute left-3 top-3 flex gap-2">
                          {item.popular && (
                            <span className="inline-flex items-center rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                              <Heart className="mr-1 h-3 w-3" />
                              Popular
                            </span>
                          )}
                          {item.recommended && (
                            <span className="inline-flex items-center rounded bg-primary-600 px-2 py-1 text-xs font-semibold text-white">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Pick
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
                        <div className="mb-1.5 flex items-start justify-between gap-3 sm:mb-2">
                          <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-neutral-900 sm:text-base">{item.name}</h3>
                          <span className="shrink-0 rounded bg-primary-50 px-2.5 py-1 text-sm font-black text-primary-700 shadow-sm">
                            {item.price}
                          </span>
                        </div>
                        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-neutral-600 sm:line-clamp-3 sm:text-sm">{item.description}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2.5 text-xs text-neutral-500 sm:mt-4 sm:pt-3">
                          <span>{categoryNameBySlug[item.category] || 'Cafe'}</span>
                          {item.spiceLevel && item.spiceLevel !== 'none' && (
                            <span className="inline-flex items-center capitalize">
                              <Flame className="mr-1 h-3 w-3 text-orange-500" />
                              {item.spiceLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              initial={{ y: 48, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 48, opacity: 0, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-lg"
            >
              <div className="relative h-52 bg-primary-50 sm:h-64">
                <img
                  src={getDishImage(selectedItem)}
                  alt={selectedItem.name}
                  className="h-full w-full object-contain bg-[#fff8ec] p-3"
                  onError={(event) => {
                    event.currentTarget.src = fallbackDishImage;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/95 p-2 text-neutral-700 transition hover:bg-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(88vh-13rem)] overflow-y-auto p-5 sm:max-h-[calc(90vh-16rem)] sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary-600">
                      {categoryNameBySlug[selectedItem.category] || 'Gazra Cafe'}
                    </p>
                    <h2 className="font-display text-2xl font-black text-neutral-900 sm:text-3xl">{selectedItem.name}</h2>
                  </div>
                  <span className="rounded bg-primary-50 px-3 py-1.5 text-lg font-black text-primary-700">
                    {selectedItem.price}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-neutral-700">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuCard;
