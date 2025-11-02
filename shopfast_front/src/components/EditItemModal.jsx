import { useState } from 'react';
import { X, Save, Package, Hash } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';

const EditItemModal = ({ item, onClose }) => {
  const { updateItem, loading } = useItemsStore();
  const [formData, setFormData] = useState({
    name: item.name,
    quantity: item.quantity,
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
    const result = await updateItem(item.id, formData);
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
        {/* Header */}
        <div className="modal-header">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Save className="w-6 h-6 text-primary-600" />
            Editar Producto
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Product Name */}
          <div className="mb-6">
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
          <div className="mb-6">
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

          {/* Información del estado actual */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Estado actual:</span>{' '}
              {item.purchased ? (
                <span className="text-green-600 font-medium">Comprado</span>
              ) : (
                <span className="text-orange-600 font-medium">Pendiente</span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Puedes cambiar el estado desde la tarjeta del producto
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;