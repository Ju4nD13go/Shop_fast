// components/ItemsList.jsx
import { ShoppingBag } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import useListsStore from '../stores/listsStore';
import ItemCard from './ItemCard';

const ItemsList = () => {
  const { getFilteredItems, loading, items } = useItemsStore();
  const { currentList } = useListsStore();
  
  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded w-10"></div>
              <div className="h-10 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h3 className="empty-title">
          {currentList ? `No hay productos en "${currentList.name}"` : 'No hay productos'}
        </h3>
        <p className="empty-description">
          {currentList 
            ? 'Comienza agregando productos a esta lista' 
            : 'Selecciona una lista o crea una nueva para comenzar'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Información de la lista actual */}
      {currentList && (
        <div className="list-info">
          <h3 className="list-info-title">Lista: {currentList.name}</h3>
          <p className="list-info-subtitle">
            Mostrando {filteredItems.length} producto{filteredItems.length !== 1 ? 's' : ''} en esta lista
          </p>
        </div>
      )}
      
      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* Contador total */}
      <div className="stats-summary">
        <p className="stats-text">
          Total: <span className="stats-highlight">{filteredItems.length}</span> producto{filteredItems.length !== 1 ? 's' : ''} 
          {items.length !== filteredItems.length && (
            <> (de <span className="stats-highlight">{items.length}</span> total)</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ItemsList;