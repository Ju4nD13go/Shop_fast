// stores/itemsStore.js
import { create } from 'zustand';
import { itemsAPI, statsAPI } from '../services/api';

const useItemsStore = create((set, get) => ({
  items: [],
  stats: null,
  loading: false,
  error: null,
  filter: 'all',
  currentListId: null,

  setCurrentListId: (listId) => set({ currentListId: listId }),

  // Cargar todos los items del usuario
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await itemsAPI.getAll();
      set({ items: response.data, loading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al cargar items';
      set({ error: errorMsg, loading: false });
    }
  },

  // Cargar items de una lista específica - CORREGIDO
  fetchItemsByList: async (listId) => {
    if (!listId) {
      get().fetchItems();
      return;
    }
    
    set({ loading: true, error: null });
    try {
      // Usar el nuevo endpoint para items por lista
      const response = await itemsAPI.getByList(listId);
      set({ 
        items: response.data, 
        currentListId: listId,
        loading: false 
      });
    } catch (error) {
      console.error('Error cargando items por lista:', error);
      // Fallback: cargar todos y filtrar localmente
      await get().fetchItems();
      set({ currentListId: listId });
    }
  },

  fetchStats: async () => {
    try {
      const response = await statsAPI.getStats();
      set({ stats: response.data });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  },

  createItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await itemsAPI.create(itemData);
      set((state) => ({
        items: [...state.items, response.data],
        loading: false,
      }));
      get().fetchStats();
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al crear item';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateItem: async (id, itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await itemsAPI.update(id, itemData);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? response.data : item
        ),
        loading: false,
      }));
      get().fetchStats();
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al actualizar item';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await itemsAPI.delete(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
      get().fetchStats();
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al eliminar item';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  togglePurchased: async (id, purchased) => {
    try {
      const response = await itemsAPI.markPurchased(id, purchased);
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? response.data : item
        ),
      }));
      get().fetchStats();
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al actualizar estado';
      return { success: false, error: errorMsg };
    }
  },

  setFilter: (filter) => set({ filter }),

  getFilteredItems: () => {
    const { items, filter, currentListId } = get();
    
    let filteredItems = items;
    
    // Filtrar por lista si hay una seleccionada
    if (currentListId) {
      filteredItems = filteredItems.filter(item => item.list_id === currentListId);
    }
    
    // Aplicar filtro de estado
    if (filter === 'pending') {
      return filteredItems.filter((item) => !item.purchased);
    }
    if (filter === 'purchased') {
      return filteredItems.filter((item) => item.purchased);
    }
    
    return filteredItems;
  },

  // Obtener contador de items por lista - CORREGIDO
  getItemsCountByList: (listId) => {
    const { items } = get();
    const listItems = items.filter(item => item.list_id === listId);
    return listItems.length;
  },

  clearError: () => set({ error: null }),

  clearStore: () => set({ 
    items: [], 
    stats: null, 
    currentListId: null,
    filter: 'all',
    error: null 
  }),
}));

export default useItemsStore;