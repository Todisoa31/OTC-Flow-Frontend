import { SidebarItemType } from '@/types/general';
import { create } from 'zustand';

type Store = {
    menuStatus: boolean;
    menuItem: SidebarItemType[] | [];
    handleToogleMenu: (menuStatus: boolean) => void;
    setMenuItem: (menuItem: SidebarItemType[]) => void;
};

export const UseMenuStore = create<Store>()((set) => ({
    menuStatus: false,
    menuItem: [],
    handleToogleMenu: () => set((state) => ({ menuStatus: !state.menuStatus })),
    setMenuItem: (newMenu: SidebarItemType[]) => set(() => ({ menuItem: newMenu })),

}))