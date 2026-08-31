import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,
  notificationType: null,
  actions: {
    setNotificationType: (type) => {
      set({ notificationType: type })
    },
    setNotification: (message) => {
      set({ notification: message })
      setTimeout(() => {
        set({ notification: null })
      }, 5000)
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)
export const useNotificationType = () =>
  useNotificationStore((state) => state.notificationType)
export const useNotificationControl = () =>
  useNotificationStore((state) => state.actions)
