import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Star } from 'lucide-react';
import { FavoriteButton } from '../components/FavoriteButton';
import { FoodImage } from '../components/FoodImage';
import { GoalFitBadge } from '../components/GoalFitBadge';
import { SearchBar } from '../components/SearchBar';
import { useApp } from '../context/AppContext';
import { DEFAULT_RESTAURANT_HERO, mealPhoto, restaurantPhoto } from '../lib/foodImages';
import { mealFavoriteKey } from '../lib/favorites';
import { matchesQuery } from '../lib/search';
import { formatEgp } from '../utils';

export function RestaurantMenu() {
  const {
    profile, activeRestaurant, highlightedMealId, closeRestaurant, addMealToCart,
    isFavorite, toggleFavorite,
  } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!highlightedMealId) return;
    const el = document.getElementById(`meal-${highlightedMealId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlightedMealId, activeRestaurant]);

  const meals = useMemo(() => {
    if (!activeRestaurant) return [];
    if (!query.trim()) return activeRestaurant.meals;
    return activeRestaurant.meals.filter((m) => matchesQuery(
      query, m.name, m.description, ...m.tags,
    ));
  }, [activeRestaurant, query]);

  if (!activeRestaurant) return null;

  return (
    <div className="ingredients-layout">
      <div className="ingredients-head">
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <button type="button" className="btn-icon" onClick={closeRestaurant} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1>{activeRestaurant.name}</h1>
            <p>
              {activeRestaurant.cuisine} · {activeRestaurant.area}
              {' · '}
              <Star size={12} style={{ display: 'inline', verticalAlign: -1 }} fill="currentColor" />
              {activeRestaurant.rating}
            </p>
          </div>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder="Search meals…" />
      </div>

      <div className="restaurant-hero">
        <FoodImage
          src={restaurantPhoto(activeRestaurant.id) ?? DEFAULT_RESTAURANT_HERO}
          fallback={activeRestaurant.image}
          alt={activeRestaurant.name}
          className="restaurant-hero-img"
        />
      </div>

      <div className="ingredients-hint">
        Delivery {activeRestaurant.deliveryMins} · Delivers to {profile.area} · Pay on delivery
      </div>

      <div className="ingredients-scroll">
        {meals.length === 0 ? (
          <div className="empty" style={{ padding: '24px 0' }}>
            <p>No meals match your search.</p>
          </div>
        ) : meals.map((meal) => {
          const favKey = mealFavoriteKey(activeRestaurant.id, meal.id);
          return (
            <div
              key={meal.id}
              id={`meal-${meal.id}`}
              className={`menu-item${meal.id === highlightedMealId ? ' menu-item--highlight' : ''}`}
            >
              <div className="menu-item-thumb">
                <FoodImage
                  src={mealPhoto(meal.id)}
                  fallback={meal.image}
                  alt={meal.name}
                  className="menu-item-photo"
                />
              </div>
              <div className="menu-item-body">
                <div className="menu-item-title-row">
                  <h3>{meal.name}</h3>
                  <FavoriteButton
                    active={isFavorite(favKey)}
                    onToggle={() => toggleFavorite({
                      key: favKey,
                      kind: 'meal',
                      title: meal.name,
                      image: meal.image,
                      photoUrl: mealPhoto(meal.id) ?? undefined,
                      price: meal.price,
                      restaurantId: activeRestaurant.id,
                      mealId: meal.id,
                      vendorName: activeRestaurant.name,
                    })}
                  />
                </div>
                <p className="menu-desc">{meal.description}</p>
                <div className="menu-nutrition">
                  {meal.protein}g protein · {meal.calories} cal
                </div>
                <GoalFitBadge goal={profile.goal} meal={meal} />
                <div className="tags" style={{ marginTop: 8 }}>
                  {meal.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="menu-item-action">
                <span className="menu-price">{formatEgp(meal.price)}</span>
                <button
                  type="button"
                  className="add-btn"
                  onClick={() => addMealToCart(activeRestaurant, meal.id)}
                  aria-label={`Add ${meal.name}`}
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
