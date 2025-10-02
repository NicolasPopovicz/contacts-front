export type FilterContacts = {
    name?:    string;
    cpf?:     string;
    page?:    number;
    perPage?: number;
    sortBy?:  string;
    sortDir?: 'asc' | 'desc'
}