import { apiFetch } from './fetch'

export type Contact = {
    id: number
    name: string
    cpf: string
    phone: string
    cep: string
    address: string
    number: string
    complement?: string | null
    city: string
    state: string
    latitude?: string | null
    longitude?: string | null
    created_at?: string
    updated_at?: string
}

export async function listContacts(params: { name?: string; cpf?: string; page?: number; perPage?: number; sortBy?: string; sortDir?: 'asc' | 'desc' } = {}) {
    const q = new URLSearchParams()
    if (params.name)    q.set('name', params.name)
    if (params.cpf)     q.set('cpf', params.cpf)
    if (params.page)    q.set('page', String(params.page))
    if (params.perPage) q.set('perPage', String(params.perPage))
    if (params.sortBy)  q.set('sortBy', params.sortBy)
    if (params.sortDir) q.set('sortDir', params.sortDir)

    return apiFetch(`/contacts/list?${q.toString()}`)
}

export async function createContact(data: Partial<Contact>) {
    return apiFetch('/contact/create', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateContact(id: number, data: Partial<Contact>) {
    return apiFetch(`/contact/${id}/update`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteContact(id: number) {
    return apiFetch(`/contact/${id}/delete`, { method: 'DELETE' })
}
