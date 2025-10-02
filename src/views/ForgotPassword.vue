<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Recuperar Senha</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" variant="outlined" label="Email" type="email" />
            </v-card-text>
            <v-card-actions class="px-4 d-flex justify-space-between">
                <router-link to="/login">
                    <v-btn variant="plain" size="small">Voltar</v-btn>
                </router-link>
                <v-btn @click="handleForgot" variant="outlined" color="primary">Enviar link</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Api
import { apiFetch } from '@/api/fetch'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const loading = ref(false)
const email   = ref('')
const toast   = useToastStore();

const handleForgot = async () => {

    try {
        loading.value = true

        await apiFetch('/forgot-password', {
            method: 'POST',
            body:   JSON.stringify({ email: email.value })
        })
        toast.success('Link enviado para o email!');
    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}
</script>
