import { useMemo, useState } from 'react';
import { ChefHat, Plus, ShoppingBag } from 'lucide-react';
import { FavoriteButton } from '../components/FavoriteButton';
import { FoodImage } from '../components/FoodImage';
import { SearchBar } from '../components/SearchBar';
import {
  getProductsForSupermarket, getSupermarket, PRODUCT_CATEGORIES, recipes, supermarkets,
} from '../data/mockData';
import { useApp } from '../context/AppContext';
import { productFavoriteKey, recipeFavoriteKey } from '../lib/favorites';
import { matchesQuery } from '../lib/search';
import { productPhoto } from '../lib/productImages';
import { recipePhoto } from '../lib/foodImages';
import { getStapleProducts, hasGroceryOrderHistory } from '../lib/staples';
import { formatEgp } from '../utils';
import type { ProductCategory, ShopProduct } from '../types';

type GroceriesView = 'shop' | 'recipes';

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
    openIngredients, addToCart, showToast,
    selectedSupermarketId, setSelectedSupermarketId,
    orderHistory, isFavorite, toggleFavorite,
  } = useApp();
  const [view, setView] = useState<GroceriesView>('shop');
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

  const filteredRecipes = useMemo(() => {
    if (!query.trim()) return recipes;
    return recipes.filter((r) => matchesQuery(
      query, r.name, r.time, ...r.tags,
      ...r.ingredients.map((i) => i.name),
    ));
  }, [query]);

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

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Groceries</h1>
        <p>Pick a supermarket, browse by category, or cook at home</p>
      </div>

      <div className="groceries-segment">
        <button
          type="button"
          className={`groceries-segment-btn ${view === 'shop' ? 'active' : ''}`}
          onClick={() => setView('shop')}
        >
          Shop
        </button>
        <button
          type="button"
          className={`groceries-segment-btn ${view === 'recipes' ? 'active' : ''}`}
          onClick={() => setView('recipes')}
        >
          <ChefHat size={14} />
          Cook at home
        </button>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={view === 'shop' ? 'Search products…' : 'Search recipes…'}
      />

      {view === 'shop' ? (
        <>
          <p className="section-title">Choose supermarket</p>
          <div className="supermarket-strip">
            {supermarkets.map((sm) => (
              <button
                key={sm.id}
                type="button"
                className={`supermarket-card ${selectedSupermarketId === sm.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSupermarketId(sm.id);
                  setActiveCategory('all');
                }}
              >
                <span className="supermarket-card-emoji">{sm.image}</span>
                <span className="supermarket-card-name">{sm.name}</span>
                <span className="supermarket-card-meta">{sm.deliveryMins}</span>
              </button>
            ))}
          </div>

          <div className="supermarket-banner">
            <span>{supermarket.image}</span>
            <div>
              <strong>{supermarket.name}</strong>
              <p>{supermarket.tagline} · {allProducts.length} products</p>
            </div>
          </div>

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
              {products.map((p) => {
                const favKey = productFavoriteKey(p.id);
                return (
                  <div key={p.id} className="product-line">
                    <div className="product-line-thumb">
                      <FoodImage
                        src={productPhoto(p)}
                        fallback={p.image}
                        alt=""
                        className="product-line-img"
                      />
                    </div>
                    <div className="product-line-info">
                      <h4>{p.brand} — {p.name}</h4>
                      <p>{p.size}</p>
                    </div>
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
                    />
                    <div className="product-line-price">{formatEgp(p.price)}</div>
                    <button type="button" className="add-btn" onClick={() => addProduct(p)} aria-label="Add">
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}

          {visibleProducts.length === 0 && (
            <div className="empty" style={{ padding: '32px 0' }}>
              <p>{query ? 'No products match your search.' : `No products in this category at ${supermarket.name}.`}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="recipes-intro">
            <p>
              Recipes live here so shopping stays front and center.
              Ingredients are added from <strong>{supermarket.name}</strong> — change supermarket in Shop.
            </p>
          </div>
          <div className="recipe-list">
            {filteredRecipes.length === 0 ? (
              <div className="empty" style={{ padding: '24px 0' }}>
                <p>No recipes match your search.</p>
              </div>
            ) : filteredRecipes.map((recipe) => {
              const favKey = recipeFavoriteKey(recipe.id);
              return (
                <article key={recipe.id} className="recipe-item">
                  <div className="recipe-visual recipe-photo-wrap">
                    <FoodImage
                      src={recipePhoto(recipe.id)}
                      fallback={recipe.image}
                      alt=""
                      className="recipe-photo"
                    />
                  </div>
                  <div className="recipe-content">
                    <div className="menu-item-title-row">
                      <h3>{recipe.name}</h3>
                      <FavoriteButton
                        active={isFavorite(favKey)}
                        onToggle={() => toggleFavorite({
                          key: favKey,
                          kind: 'recipe',
                          title: recipe.name,
                          image: recipe.image,
                          recipeId: recipe.id,
                        })}
                      />
                    </div>
                    <p className="meta">{recipe.time} · {recipe.servings} servings · {recipe.ingredients.length} ingredients</p>
                    <div className="recipe-tags">
                      {recipe.tags.map((tag) => (
                        <span key={tag} className="recipe-tag">{tag}</span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: 12 }}
                      onClick={() => openIngredients(recipe)}
                    >
                      <ShoppingBag size={16} />
                      Shop ingredients
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
