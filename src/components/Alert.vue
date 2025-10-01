<template>
    <transition name="slide-fade">
        <v-alert v-if="visible" :type="type" border="start" elevation="2" class="ma-3">
            {{ message }}
        </v-alert>
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    message: String,
    type: { type: String, default: 'success' }, // success | error
    timeout: { type: Number, default: 3000 }
})

const visible = ref(true)

watch(() => props.message, () => {
    visible.value = true
    setTimeout(() => (visible.value = false), props.timeout)
})
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
