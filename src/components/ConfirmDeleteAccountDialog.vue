<template>
    <v-dialog v-model="model" max-width="400">
        <v-card>
            <v-card-title class="text-h6">
                Excluir Conta
            </v-card-title>

            <v-card-text>
                Tem certeza que deseja <strong>excluir permanentemente</strong> sua conta?
                Esta ação não pode ser desfeita.
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text @click="close">Cancelar</v-btn>
                <v-btn @click="confirmDelete" :loading="loading" color="error">
                    Confirmar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// Auth
import { useAuthStore } from '@/stores/auth'

// Api
import { apiFetch } from '@/api/fetch'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const props = defineProps<{
    modelValue: boolean
    password:   string
}>()
const emit  = defineEmits(['update:modelValue'])

const model = computed({
    get: ()  => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const loading = ref(false)
const router  = useRouter()
const toast   = useToastStore()
const auth    = useAuthStore()

const close = () => {
    model.value = false
}

const confirmDelete = async () => {
    try {
        loading.value = true

        if (!props.password) {
            toast.error('É necessário informar a senha para excluir a conta.')
            return
        }

        await apiFetch('/user/delete', {
            method: 'DELETE',
            body:   JSON.stringify({ password: props.password })
        })

        auth.logout()
        toast.success('Conta excluída com sucesso.')
        router.push('/login')
    } catch (err: any) {
        handleApiError(err)
    } finally {
        loading.value = false
        close()
    }
}

</script>
