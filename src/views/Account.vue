<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Excluir Conta</v-card-title>
            <v-card-text>
                <v-text-field v-model="password" label="Senha atual" type="password" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" block @click="handleDelete">Excluir</v-btn>
            </v-card-actions>
        </v-card>

        <Alert v-if="alert.message" :message="alert.message" :type="alert.type" />
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { apiFetch } from '../api/fetch'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Alert from '../components/Alert.vue'

const password = ref('')
const alert = ref({ message: '', type: 'success' })
const router = useRouter()
const auth = useAuthStore()

const handleDelete = async () => {
    try {
        await apiFetch('/user/delete', {
            method: 'DELETE',
            body: JSON.stringify({ password: password.value })
        })
        alert.value = { message: 'Conta excluída com sucesso.', type: 'success' }
        auth.logout()
        setTimeout(() => router.push('/register'), 2000)
    } catch (err) {
        alert.value = { message: err.message || 'Erro ao excluir conta.', type: 'error' }
    }
}
</script>
