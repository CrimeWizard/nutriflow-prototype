import { ChevronRight, Clock, Star } from 'lucide-react';
import { getRestaurantsInArea } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function Restaurants() {
  const { profile, openRestaurant, goTab } = useApp();
  const list = getRestaurantsInArea(profile.area);

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Eat out</h1>
        <p>Healthy restaurants delivering to {profile.area}</p>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <h3>No restaurants in {profile.area} yet</h3>
          <p>We&apos;re expanding — cook at home from the supermarket for now.</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => goTab('groceries')}>
            Browse groceries
          </button>
        </div>
      ) : (
        <div className="restaurant-list">
          {list.map((r) => (
            <button
              key={r.id}
              type="button"
              className="restaurant-card"
              onClick={() => openRestaurant(r)}
            >
              <div className="restaurant-thumb">{r.image}</div>
              <div className="restaurant-info">
                <h3>{r.name}</h3>
                <p className="restaurant-cuisine">{r.cuisine} · {r.area}</p>
                <div className="restaurant-meta">
                  <span><Star size={12} fill="currentColor" /> {r.rating}</span>
                  <span><Clock size={12} /> {r.deliveryMins}</span>
                </div>
                <div className="tags" style={{ marginTop: 8 }}>
                  {r.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <ChevronRight size={18} className="restaurant-chevron" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
