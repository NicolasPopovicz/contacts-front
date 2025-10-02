<template>
    <v-container fluid class="pa-4">
        <v-row>
            <v-col cols="12" md="7">
                <v-card class="pa-4">
                    <v-card-title>
                        <v-row align="center" class="w-100 justify-end">
                            <v-col cols="12" md="8" class="d-flex align-start py-0 pr-0 mt-5">
                                <v-text-field
                                    v-model="filter" @input="applyFilter"
                                    variant="outlined" class="flex-grow-1 mr-3"
                                    label="Buscar por nome ou CPF" density="comfortable"
                                />
                                <v-btn @click="openCreate" color="primary" class="mt-2">Novo Contato</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                            :headers="headers" :items="filtered" :page.sync="page"
                            :items-per-page.sync="perPage" :items-per-page-text="'Registros por página:'"
                            :page-text="'{0} - {1} de {2}'" :sort-by="sortBy"
                            :loading="loading" :footer-props="{ 'items-per-page-options': [5, 10, 20, 50] }"
                            item-key="id" class="elevation-1" loading-text="Carregando..."
                        >
                            <template #item.actions="{ item }">
                                <v-btn @click.stop="selectContact(item)" size="small" variant="text">
                                    Ver no mapa
                                </v-btn>
                                <v-btn @click="openEdit(item)" size="small" variant="text">
                                    Editar
                                </v-btn>
                                <v-btn @click="askDelete(item)" size="small" color="error" variant="text">
                                    Excluir
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Mapa -->
            <v-col cols="12" md="5">
                <v-card>
                    <div id="map" style="height: 700px;"></div>
                </v-card>
            </v-col>
        </v-row>

        <ContactFormDialog v-model="showForm" :contact="editing" @saved="contacts" />
        <ConfirmDialog
            v-model="showConfirm" @confirm="doDelete"
            :message="`Tem certeza que deseja excluir o contato '${editing?.name}'?`"
        />
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Api
import { listContacts, deleteContact } from '@/api/contacts'

// Types
import type { DataTableSortItem } from 'vuetify'
import type { Contact } from '@/types/Contacts'

// Components
import ContactFormDialog from '@/components/ContactFormDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const toast = useToastStore()

const loading = ref(false)
const rows    = ref<Contact[]>([])

const showForm    = ref(false)
const showConfirm = ref(false)
const editing     = ref<Contact | null>(null)

const page    = ref(1)
const perPage = ref(10)

// Declaração dos filtros (order e filter)
const sortBy = ref<DataTableSortItem[]>([{ key: 'name', order: 'asc' }])
const filter = ref('')

// Variáveis de inicialização do Maps e do marcador
let map:    google.maps.Map | null = null
let marker: google.maps.Marker | null = null

// Métodos para CRUD dos contatos
const openCreate = () => { editing.value = null; showForm.value = true }
const openEdit   = (c: Contact) => { console.log(c); editing.value = c; showForm.value = true }
const askDelete  = (c: Contact) => { editing.value = c; showConfirm.value = true }

const applyFilter = () => { page.value = 1 }

// Header para montar a tabela
const headers = [
    { title: 'Nome',     key: 'name',    sortable: true },
    { title: 'CPF',      key: 'cpf',     sortable: true },
    { title: 'Telefone', key: 'phone',   sortable: true },
    { title: 'UF',       key: 'state',   sortable: true },
    { title: 'Ações',    key: 'actions', sortable: false }
]

// Aplica os filtros ou ordenação na tabela
const filtered = computed(() => {
    const filterValue = filter.value.trim().toLowerCase()
    let rowsTable = [...rows.value]

    if (filterValue) {
        // Filtra por Nome ou CPF
        rowsTable = rowsTable.filter(row =>
            row.name?.toLowerCase().includes(filterValue) ||
            row.cpf?.toLowerCase().includes(filterValue)
        )
    }

    // Ordenações pelas colunas da tabela
    if (sortBy.value.length && sortBy.value[0]) {
        const key   = sortBy.value[0]!.key
        const order = sortBy.value[0]!.order === 'desc' ? 'desc' : 'asc'

        rowsTable.sort((a: any, b: any) => {
            const A = (a as any)[key] ?? ''
            const B = (b as any)[key] ?? ''
            return (A > B ? 1 : A < B ? -1 : 0) * (order === 'desc' ? -1 : 1)
        })
    }

    return rowsTable
})

// Centraliza o mapa e marca com um pin a localização.
const selectContact = (contact: Contact) => {
    if (!map || !contact?.latitude || !contact?.longitude) return

    const position = {
        lat: Number(contact.latitude),
        lng: Number(contact.longitude),
    }

    map.setCenter(position)
    map.setZoom(15)

    if (!marker) {
        marker = new google.maps.Marker({ position, map, title: contact.name })
    } else {
        marker.setPosition(position)
        marker.setTitle(contact.name)
    }
}

// Faz a requisição para listar os contatos
async function contacts() {
    try {
        loading.value = true
        const res = await listContacts()
        rows.value = res.data ?? res ?? []
    } catch (err: any) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}

// Método para deletar o contato
const doDelete = async () => {
    if (!editing.value?.id) return

    try {
        await deleteContact(editing.value.id)
        toast.success('Contato excluído com sucesso!')
        await contacts()
    } catch (err: any) {
        handleApiError(err)
    }
}

onMounted(async () => {
    await contacts()

    // Inicializa mapa
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -25.4554844, lng: -49.2404863 }, // Curitiba default
        zoom: 11.91
    })
})
</script>
