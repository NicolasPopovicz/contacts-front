import { defineStore } from 'pinia'

// Interface
import type Toast from '@/interfaces/IToast'

// Types
import type { ToastType } from '@/types/Toast'

// Declaração para utilizar o modal
export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as Toast[],
        counter: 0
    }),
    actions: {
        push(message: string, type: ToastType = 'success', ttlMs = 5000) {
            const id = ++this.counter
            this.toasts.push({ id, type, message, expiresAt: Date.now() + ttlMs })
        },

        success(msg: string) {
            this.push(msg, 'success')
        },

        error(msg: string) {
            this.push(msg, 'error')
        },

        remove(id: number) {
            this.toasts = this.toasts.filter(t => t.id !== id)
        },

        gc() {
            const now = Date.now()
            this.toasts = this.toasts.filter(t => t.expiresAt > now)
        }
    }
})
