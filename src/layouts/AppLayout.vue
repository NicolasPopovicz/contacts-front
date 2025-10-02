<template>
    <v-app>
        <v-app-bar flat color="surface">
            <v-app-bar-title class="text-primary">Contacts App</v-app-bar-title>
            <v-spacer />
            <v-btn variant="text" color="primary" to="/contacts">Contatos</v-btn>
            <v-btn variant="text" color="primary" class="mx-2" to="/account">Minha Conta</v-btn>
            <v-btn @click="logout" variant="outlined" color="error">Sair</v-btn>
        </v-app-bar>

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Auth
import { useAuthStore } from '@/stores/auth'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const auth   = useAuthStore()
const router = useRouter()

const logout = async () => {
    try {
        await auth.logout()
        router.push('/login')
    } catch (err) {
        handleApiError(err)
        console.error('Erro no logout', err)
    }
}
</script>
