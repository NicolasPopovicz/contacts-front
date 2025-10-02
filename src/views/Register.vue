<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Criar Conta</v-card-title>
            <v-card-text>
                <v-text-field v-model="name" :disabled="loading" :rules="[rules.required]" variant="outlined" label="Nome" required/>
                <v-text-field v-model="email" :disabled="loading" :rules="[rules.required]" variant="outlined" label="Email" type="email" required/>
                <v-text-field v-model="password" :disabled="loading" :rules="[rules.required]" variant="outlined" label="Senha" type="password" required/>
                <v-text-field v-model="password_confirmation" :disabled="loading" :rules="[rules.required]" variant="outlined" label="Confirme a Senha" type="password" required/>
            </v-card-text>
            <v-card-actions class="px-4">
                <v-btn @click="handleRegister" color="primary" variant="outlined" block>Registrar</v-btn>
            </v-card-actions>
            <v-card-text class="d-flex justify-center gap-2">
                Já tem conta?&nbsp;
                <router-link to="/login">Faça login</router-link>
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Api
import { apiFetch } from '@/api/fetch'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const loading  = ref(false)
const name     = ref('')
const email    = ref('')
const password = ref('')
const password_confirmation = ref('')

const toast  = useToastStore();
const router = useRouter()

// regras de validação
const rules = {
    required: (v: string) => !!v || 'Campo obrigatório'
}

const handleRegister = async () => {
    if (password.value !== password_confirmation.value) {
        handleApiError('As senhas precisam ser idênticas')
        return;
    }

    try {
        loading.value = true

        const res = await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify({ name: name.value, email: email.value, password: password.value, password_confirmation: password_confirmation.value })
        })

        if (res.success) {
            toast.success('Cadastro realizado! Redirecionando para o login.')
            setTimeout(() => router.push('/login'), 1000)
        }

        if (!res.success) {
            handleApiError(res)
        }
    } catch (err: any) {
        handleApiError(err)
    } finally {
        loading.value = false
    }
}
</script>
