// stores/listsStore.js
import { create } from 'zustand';
import { listsAPI } from '../services/api';

const useListsStore = create((set, get) => ({
  lists: [], // Asegurar que el estado inicial es un array vacío
  currentList: null,
  loading: false,
  error: null,

  fetchLists: async () => {
    console.log('🔄 fetchLists iniciado');
    set({ loading: true, error: null });
    try {
      const response = await listsAPI.getAll();
      console.log('✅ fetchLists exitoso:', response.data);
      set({ lists: response.data || [], loading: false }); // Asegurar que siempre sea un array
    } catch (error) {
      console.error('❌ fetchLists error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error al cargar listas';
      set({
        error: errorMsg,
        loading: false,
        lists: [] // Resetear a array vacío en caso de error
      });
    }
  },

  createList: async (listData) => {
    console.log('🔄 createList iniciado:', listData);
    set({ loading: true, error: null });
    try {
      const response = await listsAPI.create(listData);
      console.log('✅ createList exitoso:', response.data);
      set((state) => ({
        lists: [...(state.lists || []), response.data],
        loading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ createList error:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error al crear lista';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateList: async (id, listData) => {
    set({ loading: true, error: null });
    try {
      const response = await listsAPI.update(id, listData);
      set((state) => ({
        lists: (state.lists || []).map((list) =>
          list.id === id ? response.data : list
        ),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al actualizar lista';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteList: async (id) => {
    set({ loading: true, error: null });
    try {
      await listsAPI.delete(id);
      set((state) => ({
        lists: (state.lists || []).filter((list) => list.id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error al eliminar lista';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  setCurrentList: (list) => {
    console.log('🔄 setCurrentList:', list);
    set({ currentList: list });
  },

  clearError: () => set({ error: null }),
}));

export default useListsStore;