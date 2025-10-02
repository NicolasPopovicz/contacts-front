import { apiFetch } from './fetch'

// Consulta o endereço quando digitado o CEP ou estado/cidade/endereco
export async function searchAddress(params: Record<string,string>) {
    const qString = new URLSearchParams(params).toString()
    return apiFetch(`/address/search?${qString}`)
}