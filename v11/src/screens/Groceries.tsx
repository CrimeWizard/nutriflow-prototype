import { useMemo, useState } from 'react';
import { GroceryProductCard } from '../components/GroceryProductCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { SupermarketPicker } from '../components/SupermarketPicker';
import {
  getProductsForSupermarket, getSupermarket, PRODUCT_CATEGORIES, supermarkets,
} from '../data/mockData';
import { useApp } from '../context/AppContext';
import { productFavoriteKey } from '../lib/favorites';
import { productPhoto } from '../lib/productImages';
import { matchesQuery } from '../lib/search';
import { getStapleProducts, hasGroceryOrderHistory } from '../lib/staples';
import type { ProductCategory, ShopProduct } from '../types';

function groupByCategory(products: ShopProduct[]) {
  const groups: Partial<Record<ProductCategory, ShopProduct[]>> = {};
  products.forEach((p) => {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category]!.push(p);
  });
  return PRODUCT_CATEGORIES
    .filter((cat) => groups[cat]?.length)
    .map((cat) => ({ category: cat, products: groups[cat]! }));
}

export function Groceries() {
  const {
    cart, addToCart, updateCartQuantity, showToast,
    selectedSupermarketId, setSelectedSupermarketId,
    orderHistory, isFavorite, toggleFavorite,
  } = useApp();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const supermarket = getSupermarket(selectedSupermarketId) ?? supermarkets[0];
  const allProducts = useMemo(
    () => getProductsForSupermarket(selectedSupermarketId),
    [selectedSupermarketId],
  );

  const staples = useMemo(
    () => getStapleProducts(selectedSupermarketId, orderHistory),
    [selectedSupermarketId, orderHistory],
  );
  const staplesFromHistory = hasGroceryOrderHistory(orderHistory);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return allProducts;
    return allProducts.filter((p) => matchesQuery(
      query, p.name, p.brand, p.category, p.size,
    ));
  }, [allProducts, query]);

  const visibleProducts = activeCategory === 'all'
    ? filteredProducts
    : filteredProducts.filter((p) => p.category === activeCategory);

  const productGroups = activeCategory === 'all'
    ? groupByCategory(filteredProducts)
    : [{ category: activeCategory, products: visibleProducts }];

  const categoriesInStore = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return PRODUCT_CATEGORIES.filter((c) => set.has(c));
  }, [allProducts]);

  const cartQtyByProductId = useMemo(() => {
    const map = new Map<string, { cartLineId: string; quantity: number }>();
    cart.forEach((line) => {
      if (line.source !== 'supermarket' || line.vendorName !== supermarket.name || !line.productId) {
        return;
      }
      map.set(line.productId, { cartLineId: line.cartLineId, quantity: line.quantity });
    });
    return map;
  }, [cart, supermarket.name]);

  const cartLineFor = (productId: string) => cartQtyByProductId.get(productId);

  const addProduct = (p: ShopProduct, toastOnFirst = true) => {
    const existing = cartLineFor(p.id);
    if (existing) {
      updateCartQuantity(existing.cartLineId, existing.quantity + 1);
      return;
    }
    addToCart([{
      productId: p.id,
      brand: p.brand,
      name: p.name,
      size: p.size,
      price: p.price,
      image: p.image,
      source: 'supermarket',
      vendorName: supermarket.name,
    }]);
    if (toastOnFirst) showToast(`Added ${p.brand} ${p.name}`);
  };

  const decrementProduct = (p: ShopProduct) => {
    const existing = cartLineFor(p.id);
    if (existing) updateCartQuantity(existing.cartLineId, existing.quantity - 1);
  };

  const renderProductCard = (p: ShopProduct, variant: 'grid' | 'staple' = 'grid') => {
    const favKey = productFavoriteKey(p.id);
    const qty = cartLineFor(p.id)?.quantity ?? 0;

    return (
      <GroceryProductCard
        key={p.id}
        product={p}
        qty={qty}
        variant={variant}
        favoriteActive={isFavorite(favKey)}
        onToggleFavorite={() => toggleFavorite({
          key: favKey,
          kind: 'product',
          title: `${p.brand} ${p.name}`,
          image: p.image,
          photoUrl: productPhoto(p) ?? undefined,
          price: p.price,
          productId: p.id,
          vendorName: supermarket.name,
        })}
        onAdd={(toastOnFirst) => addProduct(p, toastOnFirst)}
        onDecrement={() => decrementProduct(p)}
      />
    );
  };

  return (
    <div className="scroll fade-in groceries-catalog">
      <ScreenHeader
        title="Groceries"
        subtitle="Pick a supermarket and shop by category"
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search products…"
        compact
      />

      <SupermarketPicker
        selectedId={selectedSupermarketId}
        onSelect={(id) => {
          setSelectedSupermarketId(id);
          setActiveCategory('all');
        }}
      />

      {staples.length > 0 && !query && (
        <section className="groceries-staples">
          <p className="section-title">{staplesFromHistory ? 'Your staples' : 'Suggested staples'}</p>
          <div className="groceries-staples-scroll">
            {staples.map((p) => renderProductCard(p, 'staple'))}
          </div>
        </section>
      )}

      <p className="section-title">Categories</p>
      <div className="category-scroll">
        <button
          type="button"
          className={`category-chip ${activeCategory === 'all' ? 'selected' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categoriesInStore.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-chip ${activeCategory === cat ? 'selected' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {productGroups.map(({ category, products }) => (
        <div key={category} className="product-category-block">
          {activeCategory === 'all' && (
            <p className="section-title">{category}</p>
          )}
          <div className="grocery-grid">
            {products.map((p) => renderProductCard(p))}
          </div>
        </div>
      ))}

      {visibleProducts.length === 0 && (
        <div className="empty" style={{ padding: '32px 0' }}>
          <p>{query ? 'No products match your search.' : `No products in this category at ${supermarket.name}.`}</p>
        </div>
      )}
    </div>
  );
}
