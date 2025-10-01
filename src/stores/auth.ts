import { defineStore } from 'pinia'
import { apiFetch } from '../api/fetch'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async register(payload: any) {
            const data = await apiFetch('/register', {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            this.user = data.data.user
            this.token = data.data.token
            localStorage.setItem('token', String(this.token))
        },
        async login(email: string, password: string) {
            const data = await apiFetch('/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            })
            this.user = data.data.user
            this.token = data.data.token
            localStorage.setItem('token', String(this.token))
        },
        async logout() {
            await apiFetch('/logout', { method: 'POST' })
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        }
    }
})
