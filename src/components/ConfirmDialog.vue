<template>
    <transition name="modal-zoom">
        <v-dialog v-model="model" max-width="480">
            <v-card>
                <v-card-title class="text-error">Excluir contato</v-card-title>
                <v-card-text>{{ message }}</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="model = false">Cancelar</v-btn>
                    <v-btn color="error" :loading="loading" @click="confirm">Excluir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props   = defineProps<{ modelValue: boolean; message?: string }>()
const emit    = defineEmits(['update:modelValue', 'confirm'])
const loading = ref(false)

const model = computed({
    get: ()  => props.modelValue,
    set: (v) => emit('update:modelValue', v)
})

const confirm = () => {
    loading.value = true;
    emit('confirm');
    loading.value = false;
    model.value = false
}
</script>

<style>
.modal-zoom-enter-active,
.modal-zoom-leave-active {
    transition: all .2s ease;
}

.modal-zoom-enter-from,
.modal-zoom-leave-to {
    opacity: 0;
    transform: scale(0.97);
}
</style>
