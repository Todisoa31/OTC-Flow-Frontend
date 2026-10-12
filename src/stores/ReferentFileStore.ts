import { FileMenuSwitcherMenu } from '@/data/data';
import { MenuSwitcherType } from '@/types/general';
import { create } from 'zustand';

type Store = {
    activeMenuSwitcher: MenuSwitcherType | null;
    setActiveMenuSwitcher: (menu: MenuSwitcherType) => void;
    updateDetail: boolean;
    setUpdateDetail: () => void;
};

export const UseReferentFileStore = create<Store>()((set) => ({
    activeMenuSwitcher: FileMenuSwitcherMenu[0],
    setActiveMenuSwitcher: (menu: MenuSwitcherType) => set({ activeMenuSwitcher: menu }),
    updateDetail: false,
    setUpdateDetail: () => set((state) => ({ updateDetail: !state.updateDetail }))
}))