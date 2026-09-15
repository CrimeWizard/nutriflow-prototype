import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Restaurants } from './screens/Restaurants';
import { RestaurantMenu } from './screens/RestaurantMenu';
import { Groceries } from './screens/Groceries';
import { Ingredients } from './screens/Ingredients';
import { Profile } from './screens/Profile';
import { Cart } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { OrderSuccess } from './screens/OrderSuccess';

function AppContent() {
  const { screen, toast } = useApp();

  const showNav = ['home', 'restaurants', 'groceries', 'cart', 'profile'].includes(screen);
  const showTopBar = !['onboarding', 'restaurant-menu', 'ingredients', 'checkout', 'order-success'].includes(screen);

  return (
    <div className="shell">
      {showTopBar && <TopBar />}

      {screen === 'onboarding' && <Onboarding />}
      {screen === 'home' && <Home />}
      {screen === 'restaurants' && <Restaurants />}
      {screen === 'restaurant-menu' && <RestaurantMenu />}
      {screen === 'groceries' && <Groceries />}
      {screen === 'ingredients' && <Ingredients />}
      {screen === 'profile' && <Profile />}
      {screen === 'cart' && <Cart />}
      {screen === 'checkout' && <Checkout />}
      {screen === 'order-success' && <OrderSuccess />}

      {showNav && <BottomNav />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
