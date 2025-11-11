// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { LogOut, Plus, ArrowLeft } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useItemsStore from '../stores/itemsStore';
import useListsStore from '../stores/listsStore';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import FilterButtons from '../components/FilterButtons';
import ItemsList from '../components/ItemsList';
import AddItemModal from '../components/AddItemModal';
import ListsGrid from '../components/ListsGrid';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { fetchItems, fetchItemsByList, fetchStats, setCurrentListId } = useItemsStore();
  const { fetchLists, currentList, setCurrentList } = useListsStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchLists();
      await fetchItems(); // Cargar todos los items al inicio
      await fetchStats();
    };
    
    loadInitialData();
  }, []);

  // Cargar items cuando se selecciona una lista
  useEffect(() => {
    const loadListItems = async () => {
      if (currentList) {
        await fetchItemsByList(currentList.id);
        await fetchStats();
      }
    };
    
    loadListItems();
  }, [currentList]);

  const handleBackToLists = () => {
    setCurrentList(null);
    setCurrentListId(null);
    fetchItems(); // Recargar todos los items
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="container py-8">
        {/* Breadcrumb y navegación */}
        {currentList && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBackToLists}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Listas
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentList.name}
              </h1>
            </div>
          </div>
        )}

        {/* Mostrar listas o items según el contexto */}
        {!currentList ? (
          // Vista de listas
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Mis Listas de Compras
                </h1>
                <p className="text-gray-600">
                  Organiza tus compras en listas separadas
                </p>
              </div>
            </div>
            <ListsGrid />
          </div>
        ) : (
          // Vista de items dentro de una lista
          <div>
            {/* Stats Bar */}
            <StatsBar />

            {/* Filter & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <FilterButtons />
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                Agregar Producto
              </button>
            </div>

            {/* Items List */}
            <ItemsList />
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;