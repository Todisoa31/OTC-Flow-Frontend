import { NotificationType } from '@/types/notificationType';
import { create } from 'zustand';

type Store = {
    notifications: NotificationType | null;
    setNotifications: (notifications: NotificationType) => void;
    updateNotification: boolean;
    setUpdateNotification: () => void;
};

export const UseNotificationStore = create<Store>()((set) => ({
    notifications: null,
    updateNotification: false,
    setNotifications: (notifications: NotificationType) => set({ notifications: notifications }),
    setUpdateNotification: () => set((state) => ({ updateNotification: !state.updateNotification })),
}))