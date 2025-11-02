// components/ListsGrid.jsx
import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Pen, Trash2, ArrowRight } from 'lucide-react';
import useListsStore from '../stores/listsStore';
import useItemsStore from '../stores/itemsStore';
import CreateListModal from './CreateListModal';
import EditListModal from './EditListModal';

const ListsGrid = () => {
  const { lists, fetchLists, deleteList, setCurrentList, loading, error } = useListsStore();
  const { fetchItemsByList, getItemsCountByList } = useItemsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingList, setEditingList] = useState(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const handleSelectList = async (list) => {
    setCurrentList(list);
    await fetchItemsByList(list.id);
  };

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar esta lista? Se eliminarán todos los productos asociados.')) {
      await deleteList(listId);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
        <button
          onClick={fetchLists}
          className="btn-primary"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!lists || lists.length === 0) {
    return (
      <>
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h3 className="empty-title">No hay listas de compras</h3>
          <p className="empty-description">
            Crea tu primera lista para comenzar a organizar tus compras
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Lista
          </button>
        </div>

        {showCreateModal && (
          <CreateListModal onClose={() => setShowCreateModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="lists-grid">
        {/* Card para crear nueva lista */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="list-card border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 cursor-pointer flex flex-col items-center justify-center min-h-[200px] text-center group"
        >
          <Plus className="w-8 h-8 text-gray-400 mb-2 group-hover:text-primary-600 transition-colors" />
          <h3 className="font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
            Crear Nueva Lista
          </h3>
          <p className="text-sm text-gray-500 mt-1">Agregar una nueva lista de compras</p>
        </div>

        {/* Listas existentes */}
        {lists.map((list) => {
          const itemsCount = getItemsCountByList(list.id);
          return (
            <div
              key={list.id}
              onClick={() => handleSelectList(list)}
              className="list-card cursor-pointer group"
            >
              <div className="list-header">
                <div className="flex-1">
                  <h3 className="list-name">{list.name}</h3>
                  <p className="list-count">
                    {itemsCount} producto{itemsCount !== 1 ? 's' : ''}
                  </p>
                </div>
                
                {/* Botones de acción siempre visibles */}
                <div className="action-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingList(list);
                    }}
                    className="action-btn edit"
                    title="Editar lista"
                  >
                    <Pen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="action-btn delete"
                    title="Eliminar lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectList(list);
                  }}
                  className="flex-1 btn-primary flex items-center gap-2 justify-center rounded-xl"
                >
                  Abrir Lista
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {showCreateModal && (
        <CreateListModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingList && (
        <EditListModal 
          list={editingList} 
          onClose={() => setEditingList(null)} 
        />
      )}
    </>
  );
};

export default ListsGrid;