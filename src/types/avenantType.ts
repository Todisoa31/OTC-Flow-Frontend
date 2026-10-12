export type AvenantOutputType = {
    id: number;
    active: boolean;
    name: string;
    date: string;
};import { create } from 'zustand';

type Store = {
    eventStart: boolean;
    setEventStart: (eventStart: boolean) => void;
};

export const UseInstallerStore = create<Store>()((set) => ({
    eventStart: false,
    setEventStart: (eventStart:boolean) => set(() => ({ eventStart: eventStart })),
}))