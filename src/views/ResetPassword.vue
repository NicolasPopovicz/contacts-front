<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Redefinir Senha</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" :disabled="loading" variant="outlined" label="Email" type="email" required/>
                <v-text-field v-model="password" :disabled="loading" variant="outlined" label="Nova Senha" type="password" required/>
                <v-text-field v-model="password_confirmation" :disabled="loading" variant="outlined" label="Confirme a Senha" type="password" required/>
            </v-card-text>
            <v-card-actions class="px-4">
                <v-btn
                    @click="handleReset"
                    :loading="loading"
                    :disabled="loading"
                    variant="outlined"
                    color="primary"
                    block
                >Redefinir</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Api
import { apiFetch } from '@/api/fetch'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const loading  = ref(false)
const email    = ref('')
const password = ref('')
const password_confirmation = ref('')

const toast  = useToastStore();
const route  = useRoute()
const router = useRouter()

const handleReset = async () => {
    if (password.value !== password_confirmation.value) {
        handleApiError('As senhas precisam ser idênticas')
        return;
    }

    try {
        loading.value = true

        await apiFetch('/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
                token: route.params.token
            })
        })
        toast.success('Senha redefinida com sucesso!')
        router.push('/login')
    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}
</script>
