import { create } from 'zustand';

type ContratDetailStore = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

export const useContratDetailStore  = create<ContratDetailStore>()((set) => ({
    refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}))