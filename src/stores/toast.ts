import { defineStore } from 'pinia'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
    id: number
    type: ToastType
    message: string
    expiresAt: number
}

export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [] as Toast[],
        counter: 0
    }),
    actions: {
        push(message: string, type: ToastType = 'success', ttlMs = 10000) {
            const id = ++this.counter
            this.toasts.unshift({ id, type, message, expiresAt: Date.now() + ttlMs })
        },
        success(msg: string) { this.push(msg, 'success') },
        error(msg: string) { this.push(msg, 'error') },
        remove(id: number) { this.toasts = this.toasts.filter(t => t.id !== id) },
        gc() {
            const now = Date.now()
            this.toasts = this.toasts.filter(t => t.expiresAt > now)
        }
    }
})
