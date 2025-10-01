const API_URL = 'http://localhost:8000/api'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as any || {})
    }

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
    const contentType = res.headers.get('content-type') || ''
    const payload = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text()

    if (!res.ok) throw payload
    return payload
}
