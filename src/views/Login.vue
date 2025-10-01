<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="mx-auto mt-10 pa-6" max-width="500">
                    <form @submit.prevent="handleLogin">
                        <v-card-title>Login</v-card-title>

                        <v-card-text>
                            <v-text-field v-model="email" label="Email" type="email" :disabled="loading" required />
                            <v-text-field v-model="password" label="Senha" type="password" :disabled="loading"
                                required />
                        </v-card-text>

                        <v-card-actions class="d-flex flex-column">
                            <v-btn color="primary" block type="submit" :loading="loading">
                                Entrar
                            </v-btn>

                            <div class="d-flex justify-space-between mt-3" style="width:100%;">
                                <router-link to="/forgot-password">Esqueci minha senha</router-link>

                                <!-- botão para redirecionar para tela de cadastro -->
                                <v-btn variant="text" color="secondary" @click="goRegister" :disabled="loading">
                                    Criar conta
                                </v-btn>
                            </div>
                        </v-card-actions>
                    </form>
                </v-card>

                <!-- alerta reutilizável -->
                <Alert v-if="alert.message" :message="alert.message" :type="alert.type" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Alert from '../components/Alert.vue'

const email = ref('')
const password = ref('')
const alert = ref({ message: '', type: 'success' })
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const parseErrorMessage = (err) => {
    if (!err) return 'Falha na requisição.'
    if (typeof err === 'string') return err
    if (err.message) return err.message
    if (err.errors) {
        // transforma { field: [msgs] } em uma string
        return Object.values(err.errors).flat().join(' ')
    }
    return 'Falha no login.'
}

const handleLogin = async () => {
    loading.value = true
    alert.value = { message: '', type: 'success' }

    try {
        await auth.login(email.value, password.value)
        alert.value = { message: 'Login realizado com sucesso!', type: 'success' }
        // redireciona breve para a lista
        setTimeout(() => router.push('/contacts'), 700)
    } catch (err) {
        const msg = parseErrorMessage(err)
        alert.value = { message: msg, type: 'error' }
    } finally {
        loading.value = false
    }
}

const goRegister = () => {
    router.push('/register')
}
</script>
