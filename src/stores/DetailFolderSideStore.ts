import { ChatSelectType, SwictherType } from '@/types/folderType';
import { create } from 'zustand';



type Store = {
    swicther: SwictherType;
    selectSwitcher: (swicther: SwictherType) => void;
    selectChat: ChatSelectType;
    setSelectChat: (value: ChatSelectType) => void;
};

export const UseDetailFolderSideStore = create<Store>()((set) => ({
    swicther: "historique",
    selectSwitcher: (value: SwictherType) => set({ swicther: value }),
    selectChat: "Controlleur",
    setSelectChat: (value: ChatSelectType) => set({ selectChat: value })
}))