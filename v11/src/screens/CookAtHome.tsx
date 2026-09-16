import { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { FavoriteButton } from '../components/FavoriteButton';
import { FoodImage } from '../components/FoodImage';
import { SearchBar } from '../components/SearchBar';
import { SupermarketPicker } from '../components/SupermarketPicker';
import { recipes } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { recipeFavoriteKey } from '../lib/favorites';
import { recipePhoto } from '../lib/foodImages';
import { matchesQuery } from '../lib/search';

export function CookAtHome() {
  const {
    openIngredients, selectedSupermarketId, setSelectedSupermarketId, isFavorite, toggleFavorite,
  } = useApp();
  const [query, setQuery] = useState('');

  const filteredRecipes = useMemo(() => {
    if (!query.trim()) return recipes;
    return recipes.filter((r) => matchesQuery(
      query, r.name, r.time, ...r.tags,
      ...r.ingredients.map((i) => i.name),
    ));
  }, [query]);

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Cook at home</h1>
        <p>Pick a supermarket, then shop ingredients for any recipe</p>
      </div>

      <SupermarketPicker
        selectedId={selectedSupermarketId}
        onSelect={setSelectedSupermarketId}
        title="Buy ingredients from"
      />

      <SearchBar value={query} onChange={setQuery} placeholder="Search recipes..." />

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
                          photoUrl: recipePhoto(recipe.id) ?? undefined,
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
    </div>
  );
}
