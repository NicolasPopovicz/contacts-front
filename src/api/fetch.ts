// Auth
import { useAuthStore } from "@/stores/auth"

const API_URL = import.meta.env.VITE_API_URL

// Método padrão para utilizar nos requests
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const auth = useAuthStore()
    const token = localStorage.getItem('token')

    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as any || {})
    }

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })

    if (res.status === 401) {
        auth.clearToken()
        window.location.href = '/login'
        return
    }

    const contentType = res.headers.get('content-type') || ''
    const payload = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text()

    if (!res.ok) throw payload

    return payload
}
