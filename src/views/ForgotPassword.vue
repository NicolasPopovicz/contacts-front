<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Recuperar Senha</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" label="Email" type="email" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="handleForgot">Enviar link</v-btn>
            </v-card-actions>
        </v-card>

        <Alert v-if="alert.message" :message="alert.message" :type="alert.type" />
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { apiFetch } from '../api/fetch'
import Alert from '../components/Alert.vue'

const email = ref('')
const alert = ref({ message: '', type: 'success' })

const handleForgot = async () => {
    try {
        await apiFetch('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email: email.value })
        })
        alert.value = { message: 'Link enviado para o email!', type: 'success' }
    } catch (err) {
        alert.value = { message: err.message || 'Erro ao enviar link.', type: 'error' }
    }
}
</script>
