export type Contact = {
    id:          number
    name:        string
    cpf:         string
    phone:       string
    cep:         string
    address:     string
    number:      string
    complement?: string | null
    city:        string
    state:       string
    latitude?:   string | null
    longitude?:  string | null
    created_at?: string
    updated_at?: string
}