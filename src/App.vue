<!-- src/App.vue -->
<template>
    <!-- container de toasts fixado no topo direito -->
    <ToastContainer />

    <!-- transição entre páginas -->
    <v-app>
        <v-main>
            <RouterView v-slot="{ Component }">
                <transition name="page-slide-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </RouterView>
        </v-main>
    </v-app>
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue'
</script>

<style>
.page-slide-fade-enter-active,
.page-slide-fade-leave-active {
    transition: all .35s ease;
}

.page-slide-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.page-slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
