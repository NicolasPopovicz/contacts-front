<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Redefinir Senha</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" :rules="[rules.required]" variant="outlined" label="Email" type="email" required/>
                <v-text-field v-model="password" :rules="[rules.required]" variant="outlined" label="Nova Senha" type="password" required/>
                <v-text-field v-model="password_confirmation" :rules="[rules.required]" variant="outlined" label="Confirme a Senha" type="password" required/>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="handleReset" color="primary" block>Redefinir</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Api
import { apiFetch } from '@/api/fetch'

// Modal
import { useToastStore } from '@/stores/toast'

// Utils
import { handleApiError } from '@/utils/parseApiError'

const email    = ref('')
const password = ref('')
const password_confirmation = ref('')

const toast  = useToastStore();
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
        toast.success('Senha redefinida com sucesso!')
        setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
        handleApiError(err)
    }
}
</script>
