import { create } from 'zustand';

type Store = {
    updateByAvenant: boolean;
    newAvenant: boolean;
    setUpdateByAvenant: () => void;
    setNewAvenant: () => void;
};

export const UseAvenantStore = create<Store>()((set) => ({
    updateByAvenant: false,
    newAvenant: false,
    setUpdateByAvenant: () => set((state) => ({ updateByAvenant: !state.updateByAvenant })),
    setNewAvenant: () => set((state) => ({ newAvenant: !state.newAvenant })),
}))