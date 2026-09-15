import { ShoppingBag } from 'lucide-react';
import { recipes } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function Recipes() {
  const { openIngredients } = useApp();

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Recipes</h1>
        <p>Pick a recipe, choose your brands, add to cart</p>
      </div>

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="recipe-item">
            <div className="recipe-visual">{recipe.image}</div>
            <div className="recipe-content">
              <h3>{recipe.name}</h3>
              <p className="meta">{recipe.time} · {recipe.ingredients.length} ingredients · {recipe.servings} servings</p>
              <div className="tags">
                {recipe.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 14 }}
                onClick={() => openIngredients(recipe)}
              >
                <ShoppingBag size={16} />
                Shop ingredients
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
