import { create } from 'zustand';

type Store = {
    updateContract: boolean;
    setUpdateContract: () => void;
};

export const UseContractStore = create<Store>()((set) => ({
    updateContract: false,
    setUpdateContract: () => set((state) => ({ updateContract: !state.updateContract }))
}))