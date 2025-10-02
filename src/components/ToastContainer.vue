<template>
    <div class="toast-container">
        <transition-group name="toast-slide">
            <v-alert
                v-for="t in toasts"
                :key="t.id"
                :type="t.type"
                @click="dismiss(t.id)"
                elevation="2"
                class="mb-2 toast"
                border="start"
            >
                <div class="whitespace-pre-wrap break-words">
                    {{ t.message }}
                </div>
            </v-alert>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

// Modal
import { useToastStore } from '@/stores/toast'

const store  = useToastStore()
const toasts = computed(() => store.toasts)

const dismiss = (id: number) => store.remove(id)

let interval: any

onMounted(()   => { interval = setInterval(() => store.gc(), 1000) })
onUnmounted(() => { clearInterval(interval) })
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 16px;
    right: 16px;
    width: min(380px, 90vw);
    z-index: 9999;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
    transition: all 0.3s ease;
}

.toast-slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.toast-slide-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.toast {
    cursor: pointer;
}

.whitespace-pre-wrap {
    white-space: pre-wrap;
}

.break-words {
    overflow-wrap: break-word;
    word-break: break-word;
}
</style>
