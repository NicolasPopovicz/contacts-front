<template>
    <transition name="modal-zoom">
        <v-dialog v-model="model" max-width="640">
            <v-card>
                <v-card-title>{{ isEdit ? 'Editar Contato' : 'Novo Contato' }}</v-card-title>

                <v-card-text>
                    <v-form ref="formRef">
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field :rules="[rules.required]" v-model="form.name" variant="outlined" label="Nome"/>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field :rules="[rules.required]" v-model="form.phone" variant="outlined" label="Telefone"/>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field :rules="[rules.required]" v-model="form.cpf" variant="outlined" label="CPF"/>
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field :rules="[rules.required]" v-model="form.cep" @focusout="handleCepSearch"
                                    variant="outlined" label="CEP"
                                />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field :rules="[rules.required]" v-model="form.state" @focusout="handleAddressSearch"
                                    variant="outlined" label="UF" maxlength="2"
                                />
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field :rules="[rules.required]" v-model="form.city" @focusout="handleAddressSearch"
                                    variant="outlined" label="Cidade"
                                />
                            </v-col>

                            <v-col cols="12" md="9">
                                <v-text-field v-model="form.address"@focusout="handleAddressSearch" variant="outlined" label="Logradouro"/>
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field :rules="[rules.required]" v-model="form.number" variant="outlined" label="Número"/>
                            </v-col>

                            <v-col cols="12">
                                <v-text-field v-model="form.complement" variant="outlined" label="Complemento (opcional)"/>
                            </v-col>

                            <input type="hidden" v-model="form.latitude" />
                            <input type="hidden" v-model="form.longitude" />
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="close" variant="text">Cancelar</v-btn>
                    <v-btn :loading="loading" @click="save" color="primary">
                        {{ isEdit ? 'Salvar' : 'Criar' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-dialog v-model="showAddressSelect" max-width="600">
                <v-card>
                    <v-card-title>Selecione um endereço</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item
                                v-for="(opt, i) in addressOptions"
                                :key="i"
                                @click="chooseAddress(opt)"
                                class="hover:bg-surface cursor-pointer"
                            >
                                {{ opt.logradouro }}, {{ opt.bairro }} - {{ opt.localidade }}/{{ opt.uf }} ({{ opt.cep }})
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="showAddressSelect = false">Fechar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-dialog>

    </transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

// Api
import { searchAddress } from '@/api/address'
import { createContact, updateContact } from '@/api/contacts'

// Modal
import { useToastStore } from '@/stores/toast'

// Types
import type { Contact } from '@/types/Contacts'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const resetForm = () => {
    Object.assign(form, {
        name: '',
        cpf: '',
        phone: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        latitude: '',
        longitude: ''
    })
}

// timer para evitar spams
let searchTimeout: any = null

const props = defineProps<{ modelValue: boolean; contact?: Contact | null }>()
const emit  = defineEmits(['update:modelValue', 'saved'])

const model = computed({
    get: ()  => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const toast   = useToastStore()
const loading = ref(false)

const formRef = ref()
const form    = reactive({
    name: '',   address: '',    cpf: '',   phone: '', cep: '',
    number: '', complement: '', city: '',  state: '', latitude: '',
    longitude: ''
})

const showAddressSelect = ref(false)
const addressOptions    = ref<any[]>([])
const addressLocked     = ref(false)

// regras de validação
const rules = {
    required: (v: string) => !!v || 'Campo obrigatório'
}

const isEdit = computed(() => !!props.contact?.id)

watch(() => props.contact, (isOpen) => {
    if (isOpen) {
        !props.contact
            ? resetForm()
            : Object.assign(form, props.contact)
    } else {
        resetForm()
    }
}, { immediate: true })

const handleCepSearch = async () => {
    if (addressLocked.value || !form.cep) return

    const cep = form.cep?.replace(/\D/g, '')

    if (cep && cep.length === 8) {
        try {
            const data = await searchAddress({ cep })

            if (data.success) {
                const dataReturned = data.data;

                const address = typeof dataReturned === "object"
                    ? dataReturned
                    : (Array.isArray(dataReturned) && data.length > 0 ? dataReturned[0] : [])

                if (dataReturned) {
                    fillAddressFields(address)
                    toast.success('Endereço preenchido a partir do CEP.')
                } else {
                    handleApiError('Nenhum endereço encontrado para este CEP.')
                }
            }

            if (!data.success) {
                handleApiError(data)
            }
        } catch (err) {
            handleApiError(err)
        }
    }
}

const handleAddressSearch = () => {
    if (addressLocked.value) return
    if (!form.state || !form.city || !form.address) return

    // evita spam: reseta timeout e inicia de novo
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
        if (form.state && form.city && form.address) {
            try {
                const data = await searchAddress({
                    state:   form.state,
                    city:    form.city,
                    address: form.address
                })

                if (data.success) {
                    const dataReturned = data.data;

                    if (Array.isArray(dataReturned)) {
                        if (dataReturned.length === 1) {
                            fillAddressFields(dataReturned[0])
                            toast.success('Endereço preenchido.')
                        } else if (dataReturned.length > 1) {
                            addressOptions.value    = dataReturned
                            showAddressSelect.value = true
                        } else {
                            handleApiError('Nenhum endereço encontrado.')
                        }
                    }
                }

                if (!data.success) {
                    handleApiError(data)
                }

            } catch (err) {
                handleApiError(err)
            }
        }
    }, 500) // espera 0.5s após sair do último campo
}

// Evento que indica qual endereço foi selecionado
const chooseAddress = (addr: any) => {
    fillAddressFields(addr)
    showAddressSelect.value = false
    addressLocked.value     = true
    toast.success('Endereço selecionado.')
}

// Preenche o formulário com o endereço selecionado na lista
const fillAddressFields = (addr: any) => {
    form.cep        = addr.cep?.replace(/\D/g, '') || ''
    form.address    = addr.logradouro || ''
    form.city       = addr.localidade || ''
    form.state      = addr.uf || ''
    form.latitude   = String(addr.latitude) || ''
    form.longitude  = String(addr.longitude) || ''
}

const close = () => { model.value = false }

const save = async () => {
    const valid = await formRef.value?.validate()

    if (!valid) return

    try {
        loading.value = true
        if (isEdit.value && props.contact) {
            const res = await updateContact(props.contact.id, form)

            if (res.success) {
                toast.success('Contato atualizado com sucesso!')
            }

            if (!res.success) {
                handleApiError(res)
            }
        } else {
            const res = await createContact(form)

            if (res.success) {
                toast.success('Contato criado com sucesso!')
            }

            if (!res.success) {
                handleApiError(res)
            }
        }
        emit('saved')
        close()
    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}
</script>

<style>
.modal-zoom-enter-active,
.modal-zoom-leave-active {
    transition: all .2s ease;
}

.modal-zoom-enter-from,
.modal-zoom-leave-to {
    opacity: 0;
    transform: scale(0.97);
}
</style>
