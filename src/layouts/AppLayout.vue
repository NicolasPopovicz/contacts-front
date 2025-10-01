<template>
    <v-app>
        <v-app-bar flat color="surface">
            <v-app-bar-title class="text-primary">📇 Meus Contatos</v-app-bar-title>
            <v-spacer />
            <v-btn variant="text" color="primary" to="/contacts">Contatos</v-btn>
            <v-btn variant="text" color="primary" to="/account">Minha Conta</v-btn>
            <v-btn variant="outlined" color="error" @click="logout">Sair</v-btn>
        </v-app-bar>

        <!-- v-main já empurra o conteúdo abaixo da barra -->
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = async () => {
    try {
        await auth.logout()
        router.push('/login')
    } catch (err) {
        console.error('Erro no logout', err)
    }
}
</script>
