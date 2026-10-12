import { create } from 'zustand';

type Store = {
    sideMenuOpen:boolean;
    toogleSideMenu: () => void;
};

export const UseSidebarMenuStore = create<Store>()((set) => ({
    sideMenuOpen: true,
    toogleSideMenu: () => set((state) => ({ sideMenuOpen: !state.sideMenuOpen })),
}))