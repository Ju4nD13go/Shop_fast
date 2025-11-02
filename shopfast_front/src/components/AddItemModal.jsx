// components/AddItemModal.jsx
import { useState } from 'react';
import { X, Plus, Package, Hash } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import useListsStore from '../stores/listsStore';

const AddItemModal = ({ onClose }) => {
  const { createItem, loading } = useItemsStore();
  const { currentList } = useListsStore();
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Asegurarse de que siempre hay un list_id
    if (!currentList?.id) {
      alert('Error: No hay lista seleccionada');
      return;
    }
    
    // Crear el objeto de datos con list_id forzado
    const itemData = {
      name: formData.name,
      quantity: formData.quantity,
      list_id: currentList.id
    };
    
    const result = await createItem(itemData);
    
    if (result.success) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary-600" />
            Agregar Producto
            {currentList && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                a {currentList.name}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="action-btn delete"
            disabled={loading}
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nombre del producto
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Ej: Leche, Pan, Huevos..."
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cantidad
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input-field pl-10"
                  min="1"
                  max="999"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Info sobre la lista */}
            {currentList && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-medium">
                  📝 Este producto se agregará a: <span className="font-bold">"{currentList.name}"</span>
                </p>
              </div>
            )}

            {!currentList && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Error: No hay lista seleccionada. Por favor, selecciona una lista primero.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary rounded-xl"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !currentList}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Agregando...
                  </>
                ) : (
                  'Agregar Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;