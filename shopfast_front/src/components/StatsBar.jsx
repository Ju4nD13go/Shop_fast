import { Package, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';

const StatsBar = () => {
  const stats = useItemsStore((state) => state.stats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage = stats.total_items > 0
    ? Math.round((stats.items_purchased / stats.total_items) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Productos */}
      <div className="stat-card stat-card-total">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Productos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_items}</p>
          </div>
          <div className="stat-icon stat-icon-total">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Comprados */}
      <div className="stat-card stat-card-purchased">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Comprados</p>
            <p className="text-3xl font-bold text-gray-900">{stats.items_purchased}</p>
          </div>
          <div className="stat-icon stat-icon-purchased">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Pendientes */}
      <div className="stat-card stat-card-pending">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-gray-900">{stats.items_pending}</p>
          </div>
          <div className="stat-icon stat-icon-pending">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Completado */}
      <div className="stat-card stat-card-completion">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Completado</p>
            <p className="text-3xl font-bold text-gray-900">{completionPercentage}%</p>
          </div>
          <div className="stat-icon stat-icon-completion">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;