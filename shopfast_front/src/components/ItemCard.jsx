import { useState } from 'react';
import { Check, X, Trash2, Edit2, Package } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import EditItemModal from './EditItemModal';

const ItemCard = ({ item }) => {
  const { togglePurchased, deleteItem } = useItemsStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePurchased = async () => {
    await togglePurchased(item.id, !item.purchased);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setIsDeleting(true);
      await deleteItem(item.id);
    }
  };

  return (
    <>
      <div
        className={`card ${item.purchased ? 'card-purchased' : 'card-pending'} ${
          isDeleting ? 'opacity-50' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${
                item.purchased ? 'bg-green-100' : 'bg-yellow-100'
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  item.purchased ? 'text-green-600' : 'text-yellow-600'
                }`}
              />
            </div>
            <div className="flex-1">
              <h3
                className={`font-semibold text-lg ${
                  item.purchased
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">
                Cantidad: <span className="font-medium">{item.quantity}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`item-status ${
              item.purchased ? 'status-purchased' : 'status-pending'
            }`}
          >
            {item.purchased ? (
              <>
                <Check className="w-3 h-3" />
                Comprado
              </>
            ) : (
              <>
                <X className="w-3 h-3" />
                Pendiente
              </>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleTogglePurchased}
            disabled={isDeleting}
            className={`btn-status ${
              item.purchased ? 'btn-status-pending' : 'btn-status-purchased'
            } disabled:opacity-50`}
          >
            {item.purchased ? 'Marcar pendiente' : 'Marcar comprado'}
          </button>
          
          {/* Botones de acción siempre visibles */}
          <div className="action-buttons">
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isDeleting}
              className="action-btn edit"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="action-btn delete"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditItemModal item={item} onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
};

export default ItemCard;