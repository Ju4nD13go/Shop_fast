// components/FilterButtons.jsx
import { Package, Clock, CircleCheckBig } from 'lucide-react';
import useItemsStore from '../stores/itemsStore';

const FilterButtons = () => {
  const { filter, setFilter } = useItemsStore();

  const filters = [
    { value: 'all', label: 'Todos', icon: Package },
    { value: 'pending', label: 'Pendientes', icon: Clock },
    { value: 'purchased', label: 'Comprados', icon: CircleCheckBig },
  ];

  return (
    <div className="filter-container">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`filter-btn ${filter === f.value ? 'active' : ''}`}
        >
          <f.icon className="lucide" />
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;