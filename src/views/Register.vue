<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Criar Conta</v-card-title>
            <v-card-text>
                <v-text-field v-model="name" label="Nome" />
                <v-text-field v-model="email" label="Email" type="email" />
                <v-text-field v-model="password" label="Senha" type="password" />
                <v-text-field v-model="password_confirmation" label="Confirme a Senha" type="password" :rules="[rules.required]" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="handleRegister">Registrar</v-btn>
            </v-card-actions>
            <v-card-text>
                <router-link to="/login">Já tem conta? Faça login</router-link>
            </v-card-text>
        </v-card>

        <Alert v-if="alert.message" :message="alert.message" :type="alert.type" />
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { apiFetch } from '../api/fetch'
import { useRouter } from 'vue-router'
import Alert from '@/components/Alert.vue'

const name     = ref('')
const email    = ref('')
const password = ref('')
const password_confirmation = ref('')
const alert  = ref({ message: '', type: 'success' })
const router = useRouter()

// regras de validação
const rules = {
    required: (v: string) => !!v || 'Campo obrigatório'
}

const handleRegister = async (e: any) => {
    if (password.value !== password_confirmation.value) {
        alert.value = { message: 'As senhas precisam ser idênticas', type: 'error' }
        return;
    }

    try {
        await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify({ name: name.value, email: email.value, password: password.value, password_confirmation: password_confirmation.value })
        })
        alert.value = { message: 'Cadastro realizado! Faça login.', type: 'success' }
        setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
        alert.value = { message: err.message || 'Erro ao cadastrar.', type: 'error' }
    }
}
</script>
