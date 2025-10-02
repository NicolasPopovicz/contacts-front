import { apiFetch } from './fetch'

// Types
import type { FilterContacts } from '@/types/Filters'
import type { Contact } from '@/types/Contacts'

export async function listContacts(params: FilterContacts = {}) {
    const qString = new URLSearchParams()

    if (params.name)    qString.set('name',    params.name)
    if (params.cpf)     qString.set('cpf',     params.cpf)
    if (params.page)    qString.set('page',    String(params.page))
    if (params.perPage) qString.set('perPage', String(params.perPage))
    if (params.sortBy)  qString.set('sortBy',  params.sortBy)
    if (params.sortDir) qString.set('sortDir', params.sortDir)

    return apiFetch(`/contacts/list?${qString.toString()}`)
}

export async function createContact(data: Partial<Contact>) {
    return apiFetch('/contact/create', {
        method: 'POST',
        body:   JSON.stringify(data)
    })
}

export async function updateContact(id: number, data: Partial<Contact>) {
    return apiFetch(`/contact/${id}/update`, {
        method: 'PUT',
        body:   JSON.stringify(data)
    })
}

export async function deleteContact(id: number) {
    return apiFetch(`/contact/${id}/delete`, { method: 'DELETE' })
}
