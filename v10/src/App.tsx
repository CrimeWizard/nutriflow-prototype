import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { BottomNav } from './components/BottomNav';
import { QuickMealPreview } from './components/QuickMealPreview';
import { TopBar } from './components/TopBar';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Restaurants } from './screens/Restaurants';
import { RestaurantMenu } from './screens/RestaurantMenu';
import { Groceries } from './screens/Groceries';
import { Supplements } from './screens/Supplements';
import { CookAtHome } from './screens/CookAtHome';
import { Ingredients } from './screens/Ingredients';
import { Profile } from './screens/Profile';
import { TodaysPlan } from './screens/TodaysPlan';
import { Cart } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { OrderSuccess } from './screens/OrderSuccess';
import { Orders } from './screens/Orders';

function AppContent() {
  const { screen, toast } = useApp();

  const showNav = ['home', 'cook-at-home', 'orders', 'today-plan', 'profile'].includes(screen);
  const showTopBar = !['onboarding', 'restaurant-menu', 'ingredients', 'checkout', 'order-success'].includes(screen);

  return (
    <div className="shell">
      {showTopBar && <TopBar />}

      {screen === 'onboarding' && <Onboarding />}
      {screen === 'home' && <Home />}
      {screen === 'restaurants' && <Restaurants />}
      {screen === 'restaurant-menu' && <RestaurantMenu />}
      {screen === 'groceries' && <Groceries />}
      {screen === 'supplements' && <Supplements />}
      {screen === 'cook-at-home' && <CookAtHome />}
      {screen === 'ingredients' && <Ingredients />}
      {screen === 'today-plan' && <TodaysPlan />}
      {screen === 'profile' && <Profile />}
      {screen === 'cart' && <Cart />}
      {screen === 'checkout' && <Checkout />}
      {screen === 'order-success' && <OrderSuccess />}
      {screen === 'orders' && <Orders />}

      {showNav && <BottomNav />}
      <QuickMealPreview />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <AppProvider>
      <div className={`app-root${splashDone ? ' app-root--ready' : ''}`}>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <AppContent />
      </div>
    </AppProvider>
  );
}
