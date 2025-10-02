<template>
    <v-container fluid class="pa-4">
        <v-row>
            <v-col cols="12" md="6">
                <v-card class="pa-4">
                    <v-card-title>
                        <v-row align="center" class="w-100 justify-end">
                            <v-col cols="12" md="6" class="d-flex align-start py-0 pr-0 mt-5">
                                <v-text-field v-model="filter" density="comfortable" variant="outlined"
                                    label="Buscar por nome ou CPF" prepend-inner-icon="mdi-magnify" class="flex-grow-1 mr-3"
                                    @input="applyFilter" />
                                <v-btn color="primary" @click="openCreate">Novo Contato</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table :headers="headers" :items="filtered" :page.sync="page" :items-per-page.sync="perPage"
                            v-model:sort-by="sortBy" item-key="id" class="elevation-1" :loading="loading"
                            loading-text="Carregando..." :footer-props="{ 'items-per-page-options': [5, 10, 20, 50] }"
                        >
                            <template #item.actions="{ item }">
                                <!-- item.raw é seu objeto original -->
                                <v-btn size="small" variant="text" @click.stop="selectContact(item)">
                                    Ver no mapa
                                </v-btn>
                                <v-btn size="small" variant="text" @click="openEdit(item)">Editar</v-btn>
                                <v-btn size="small" color="error" variant="text" @click="askDelete(item)">Excluir</v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Mapa -->
            <v-col cols="12" md="6">
                <v-card>
                    <div id="map" style="height: 700px;"></div>
                </v-card>
            </v-col>
        </v-row>

        <ContactFormDialog v-model="showForm" :contact="editing" @saved="fetchData" />
        <ConfirmDialog v-model="showConfirm" :message="`Tem certeza que deseja excluir o contato '${editing?.name}'?`"
            @confirm="doDelete" />
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { listContacts, deleteContact, type Contact } from '../api/contacts'
import { useToastStore } from '../stores/toast'
import ContactFormDialog from '../components/ContactFormDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { DataTableSortItem } from 'vuetify'

const toast = useToastStore()

const loading = ref(false)
const rows    = ref<Contact[]>([])

const headers = [
    { title: 'Nome',     key: 'name',    sortable: true },
    { title: 'CPF',      key: 'cpf',     sortable: true },
    { title: 'Telefone', key: 'phone',   sortable: true },
    { title: 'UF',       key: 'state',   sortable: true },
    { title: 'Ações',    key: 'actions', sortable: false }
]

let map: google.maps.Map | null = null
let marker: google.maps.Marker | null = null

// paginação / ordenação (no front)
const page    = ref(1)
const perPage = ref(10)

// começa ordenando por "name" ascendente
const sortBy = ref<DataTableSortItem[]>([{ key: 'name', order: 'asc' }])

// filtro
const filter = ref('')

const filtered = computed(() => {
    const s = filter.value.trim().toLowerCase()
    let data = [...rows.value]

    if (s) {
        data = data.filter(r =>
            r.name?.toLowerCase().includes(s) ||
            r.cpf?.toLowerCase().includes(s)
        )
    }

    if (sortBy.value.length && sortBy.value[0]) {
        const key = sortBy.value[0]!.key
        const order = sortBy.value[0]!.order === 'desc' ? 'desc' : 'asc'

        data.sort((a: any, b: any) => {
            const A = (a as any)[key] ?? ''
            const B = (b as any)[key] ?? ''
            return (A > B ? 1 : A < B ? -1 : 0) * (order === 'desc' ? -1 : 1)
        })
    }

    return data
})

const applyFilter = () => { page.value = 1 }

async function fetchData() {
    try {
        loading.value = true
        const res = await listContacts()
        rows.value = res.data ?? res ?? []
    } catch (err: any) {
        toast.error(err?.message || 'Erro ao carregar contatos')
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchData()

    // inicializa mapa
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: -25.4554844, lng: -49.2404863 }, // Curitiba default
        zoom: 11.91
    })
})

const showForm    = ref(false)
const showConfirm = ref(false)
const editing     = ref<Contact | null>(null)

const openCreate = () => { editing.value = null; showForm.value = true }
const openEdit   = (c: Contact) => { editing.value = c; showForm.value = true }
const askDelete  = (c: Contact) => { editing.value = c; showConfirm.value = true }

const selectContact = (contact: Contact) => {
    console.log(contact);
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

const doDelete = async () => {
    if (!editing.value?.id) return
    try {
        await deleteContact(editing.value.id)
        toast.success('Contato excluído com sucesso!')
        await fetchData()
    } catch (err: any) {
        toast.error(err?.message || 'Erro ao excluir contato')
    }
}
</script>
