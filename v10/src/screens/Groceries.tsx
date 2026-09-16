import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { FavoriteButton } from '../components/FavoriteButton';
import { FoodImage } from '../components/FoodImage';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { SupermarketPicker } from '../components/SupermarketPicker';
import {
  getProductsForSupermarket, getSupermarket, PRODUCT_CATEGORIES, supermarkets,
} from '../data/mockData';
import { useApp } from '../context/AppContext';
import { productFavoriteKey } from '../lib/favorites';
import { matchesQuery } from '../lib/search';
import { productPhoto } from '../lib/productImages';
import { getStapleProducts, hasGroceryOrderHistory } from '../lib/staples';
import { formatEgp } from '../utils';
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
    addToCart, showToast,
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

  const addProduct = (p: ShopProduct) => {
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
    showToast(`Added ${p.brand} ${p.name}`);
  };

  const renderProductCard = (p: ShopProduct) => {
    const favKey = productFavoriteKey(p.id);
    return (
      <article key={p.id} className="product-card">
        <div className="product-card-media">
          <FoodImage
            src={productPhoto(p)}
            fallback={p.image}
            alt=""
            className="product-card-img"
          />
          <FavoriteButton
            active={isFavorite(favKey)}
            onToggle={() => toggleFavorite({
              key: favKey,
              kind: 'product',
              title: `${p.brand} ${p.name}`,
              image: p.image,
              price: p.price,
              productId: p.id,
              vendorName: supermarket.name,
            })}
            size={14}
          />
        </div>
        <div className="product-card-body">
          <span className="product-card-brand">{p.brand}</span>
          <h4 className="product-card-name">{p.name}</h4>
          <p className="product-card-size">{p.size}</p>
          <div className="product-card-footer">
            <span className="product-card-price">{formatEgp(p.price)}</span>
            <button type="button" className="add-btn add-btn--sm" onClick={() => addProduct(p)} aria-label={`Add ${p.name}`}>
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="scroll fade-in">
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
        <>
          <p className="section-title">{staplesFromHistory ? 'Your staples' : 'Suggested staples'}</p>
          <div className="staples-scroll">
            {staples.map((p) => (
              <button key={p.id} type="button" className="staple-card" onClick={() => addProduct(p)}>
                <span className="staple-thumb">
                  <FoodImage
                    src={productPhoto(p)}
                    fallback={p.image}
                    alt=""
                    className="staple-thumb-img"
                  />
                </span>
                <span className="staple-name">{p.name}</span>
                <span className="staple-price">{formatEgp(p.price)}</span>
              </button>
            ))}
          </div>
        </>
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
          <div className="product-grid">
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
