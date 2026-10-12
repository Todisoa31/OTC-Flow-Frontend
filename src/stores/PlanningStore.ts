import { AvailabilityPlanningItemType, PlanningToogleType, UpdateSideType, UserPlanning } from '@/types/planningType';
import { create } from 'zustand';



type Store = {
    sideType: PlanningToogleType;
    update: boolean;
    toogleSide: (value?: PlanningToogleType) => void;
    toogleUpdate: () => void;
    updateSide: AvailabilityPlanningItemType | null
    setUpdateSide: (value: AvailabilityPlanningItemType) => void;
    currentDate: string;
    createPlanningX: UserPlanning | null;
    setCreatePlanning: (value: UserPlanning | null, currentDate?: string) => void;
};

export const UsePlanningStore = create<Store>()((set) => ({
    sideType: "Info",
    toogleSide: (value?: PlanningToogleType) => set((state) => ({
        sideType: value ? value : (state.sideType === "Info" ? "Create" : "Info"),
    })),
    update: false,
    toogleUpdate: () => set((state) => ({ update: !state.update })),
    updateSide: null,
    setUpdateSide: (value: AvailabilityPlanningItemType) => set(() => ({ updateSide: value })),
    createPlanningX: null,
    currentDate: "",
    setCreatePlanning: (value: UserPlanning | null, currentDate?: string) => set(() => ({ createPlanningX: value, currentDate }))
}))