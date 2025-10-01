<!-- src/components/ContactFormDialog.vue -->
<template>
    <transition name="modal-zoom">
        <v-dialog v-model="model" max-width="640">
            <v-card>
                <v-card-title>{{ isEdit ? 'Editar Contato' : 'Novo Contato' }}</v-card-title>

                <v-card-text>
                    <v-row dense>
                        <v-col cols="12" md="6"><v-text-field v-model="form.name" label="Nome" /></v-col>
                        <v-col cols="12" md="6"><v-text-field v-model="form.cpf" label="CPF" /></v-col>
                        <v-col cols="12" md="6"><v-text-field v-model="form.phone" label="Telefone" /></v-col>
                        <v-col cols="12" md="6"><v-text-field v-model="form.cep" label="CEP" /></v-col>
                        <v-col cols="12" md="8"><v-text-field v-model="form.address" label="Endereço" /></v-col>
                        <v-col cols="12" md="4"><v-text-field v-model="form.number" label="Número" /></v-col>
                        <v-col cols="12"><v-text-field v-model="form.complement" label="Complemento" /></v-col>
                        <v-col cols="12" md="8"><v-text-field v-model="form.city" label="Cidade" /></v-col>
                        <v-col cols="12" md="4"><v-text-field v-model="form.state" label="UF" maxlength="2" /></v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="close">Cancelar</v-btn>
                    <v-btn color="primary" :loading="loading" @click="save">{{ isEdit ? 'Salvar' : 'Criar' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </transition>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import { createContact, updateContact, type Contact } from '../api/contacts'
import { useToastStore } from '../stores/toast'

const props = defineProps<{ modelValue: boolean; contact?: Contact | null }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const model = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const toast = useToastStore()

const form = reactive<Partial<Contact>>({
    name: '', cpf: '', phone: '', cep: '', address: '', number: '',
    complement: '', city: '', state: ''
})

const isEdit = computed(() => !!props.contact?.id)

watch(() => props.contact, (c) => {
    if (c) Object.assign(form, c)
    else Object.assign(form, { name: '', cpf: '', phone: '', cep: '', address: '', number: '', complement: '', city: '', state: '' })
}, { immediate: true })

const close = () => { model.value = false }

const parseError = (err: any) => {
    if (!err) return 'Falha na requisição.'
    if (typeof err === 'string') return err
    if (err.message) return err.message
    if (err.errors) return Object.values(err.errors).flat().join(' ')
    return 'Erro ao salvar contato.'
}

const save = async () => {
    try {
        loading.value = true
        if (isEdit.value && props.contact) {
            await updateContact(props.contact.id, form)
            toast.success('Contato atualizado com sucesso!')
        } else {
            await createContact(form)
            toast.success('Contato criado com sucesso!')
        }
        emit('saved')     // informa ao pai para recarregar a lista
        close()
    } catch (err: any) {
        toast.error(parseError(err))
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
