<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="mx-auto mt-10 pa-6" max-width="500">
                    <form @submit.prevent="handleLogin">
                        <v-card-title>Login</v-card-title>

                        <v-card-text>
                            <v-text-field v-model="email" :disabled="loading" variant="outlined" label="Email" type="email" required/>
                            <v-text-field v-model="password" :disabled="loading" variant="outlined" label="Senha" type="password" required/>
                        </v-card-text>

                        <v-card-actions class="d-flex flex-column px-4">
                            <v-btn color="primary" block type="submit" variant="outlined" :loading="loading">
                                Entrar
                            </v-btn>

                            <div class="d-flex align-center justify-space-between mt-3" style="width:100%;">
                                <router-link to="/forgot-password">
                                    <v-btn variant="plain" size="small">Esqueci minha senha</v-btn>
                                </router-link>

                                <v-btn @click="goRegister" :disabled="loading" variant="outlined" color="secondary">
                                    Criar conta
                                </v-btn>
                            </div>
                        </v-card-actions>
                    </form>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Auth
import { useAuthStore } from '@/stores/auth'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const email    = ref('')
const password = ref('')
const loading  = ref(false)

const toast  = useToastStore();
const auth   = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
    loading.value = true

    try {
        await auth.login(email.value, password.value)
        toast.success('Login realizado com sucesso!')

        router.push('/contacts')
    } catch (err) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}

const goRegister = () => {
    router.push('/register')
}
</script>
