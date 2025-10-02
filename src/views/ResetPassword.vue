<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Redefinir Senha</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" label="Email" type="email" />
                <v-text-field v-model="password" label="Nova Senha" type="password" />
                <v-text-field v-model="password_confirmation" label="Confirme a Senha" type="password" :rules="[rules.required]" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="handleReset">Redefinir</v-btn>
            </v-card-actions>
        </v-card>

        <Alert v-if="alert.message" :message="alert.message" :type="alert.type" />
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '../api/fetch'
import Alert from '../components/Alert.vue'

const email    = ref('')
const password = ref('')
const password_confirmation = ref('')
const alert  = ref({ message: '', type: 'success' })
const route  = useRoute()
const router = useRouter()

const handleReset = async () => {
    try {
        await apiFetch('/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
                token: route.params.token
            })
        })
        alert.value = { message: 'Senha redefinida com sucesso!', type: 'success' }
        setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
        alert.value = { message: err.message || 'Erro ao redefinir senha.', type: 'error' }
    }
}
</script>
