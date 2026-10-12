import { FileMenuSwitcherMenu } from '@/data/data';
import { MenuSwitcherType } from '@/types/general';
import { create } from 'zustand';

type Store = {
    activeMenuSwitcher: MenuSwitcherType | null;
    setActiveMenuSwitcher: (menu: MenuSwitcherType) => void;
    updateDetail: boolean;
    setUpdateDetail: () => void;
    updateContratDetail: boolean;
    setUpdateContratDetail: () => void;
};

export const UseAdminStore = create<Store>()((set) => ({
    activeMenuSwitcher: FileMenuSwitcherMenu[0],
    setActiveMenuSwitcher: (menu: MenuSwitcherType) => set({ activeMenuSwitcher: menu }),
    updateDetail: false,
    setUpdateDetail: () => set((state) => ({ updateDetail: !state.updateDetail })),
    updateContratDetail: false,
    setUpdateContratDetail: () => set((state) => ({ updateContratDetail: !state.updateContratDetail }))
}))