import { AppProvider, useApp } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Recipes } from './screens/Recipes';
import { Ingredients } from './screens/Ingredients';
import { Market } from './screens/Market';
import { Cart } from './screens/Cart';
import { Checkout } from './screens/Checkout';
import { OrderSuccess } from './screens/OrderSuccess';

function AppContent() {
  const { screen, toast } = useApp();

  const showNav = ['home', 'recipes', 'market', 'cart'].includes(screen);
  const showTopBar = screen !== 'onboarding' && screen !== 'ingredients' && screen !== 'order-success';

  return (
    <div className="shell">
      {showTopBar && <TopBar showSettings={screen === 'home'} />}

      {screen === 'onboarding' && <Onboarding />}
      {screen === 'home' && <Home />}
      {screen === 'recipes' && <Recipes />}
      {screen === 'ingredients' && <Ingredients />}
      {screen === 'market' && <Market />}
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
