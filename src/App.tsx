import { InventoryProvider, useInventory } from './context/InventoryContext';
import { InventoryManager } from './views/InventoryManager';
import { MosaicStudio } from './views/MosaicStudio';

function AppContent() {
  const { currentView } = useInventory();

  return currentView === 'inventory' ? <InventoryManager /> : <MosaicStudio />;
}

function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}

export default App;
