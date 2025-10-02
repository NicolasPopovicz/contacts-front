<template>
    <v-container>
        <v-card class="mx-auto mt-10 pa-6" max-width="400">
            <v-card-title>Excluir Conta</v-card-title>
            <v-card-text>
                <v-text-field v-model="password" variant="outlined" label="Senha atual" type="password" />
            </v-card-text>
            <v-card-actions class="px-4 d-flex justify-space-between">
                <router-link to="/contacts">
                    <v-btn variant="plain" size="small">Voltar</v-btn>
                </router-link>
                <v-btn @click="showDeleteDialog = true" variant="outlined" color="error">Excluir</v-btn>
            </v-card-actions>
        </v-card>

        <ConfirmDeleteAccountDialog v-model="showDeleteDialog" :password="password"/>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Components
import ConfirmDeleteAccountDialog from '@/components/ConfirmDeleteAccountDialog.vue'

const password = ref('')

const showDeleteDialog = ref(false)
</script>
