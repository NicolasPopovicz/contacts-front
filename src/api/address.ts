import { apiFetch } from './fetch'

export async function searchAddress(params: Record<string,string>) {
    const q = new URLSearchParams(params).toString()
    return apiFetch(`/address/search?${q}`)
}