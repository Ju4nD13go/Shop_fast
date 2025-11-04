// components/CreateListModal.jsx
import { useState } from 'react';
import { X, Plus, List } from 'lucide-react';
import useListsStore from '../stores/listsStore';

const CreateListModal = ({ onClose }) => {
  const { createList, loading } = useListsStore();
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createList(formData);
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
            Crear Nueva Lista
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
            {/* List Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nombre de la lista
              </label>
              <div className="relative">
                <List className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Ej: Supermercado, Farmacia, Ferretería..."
                  required
                  autoFocus
                  disabled={loading}
                />
              </div>
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
                    Creando...
                  </div>
                ) : (
                  'Crear Lista'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListModal;