import { ChevronRight, Clock, Star } from 'lucide-react';
import { restaurants } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function Restaurants() {
  const { profile, openRestaurant } = useApp();

  const filtered = restaurants.filter(
    (r) => r.area === profile.area || profile.area === 'New Cairo',
  );
  const list = filtered.length > 0 ? filtered : restaurants;

  return (
    <div className="scroll fade-in">
      <div className="page-header">
        <h1>Eat out</h1>
        <p>Healthy restaurants & food shops near you</p>
      </div>

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
    </div>
  );
}
