import { createRouter, createWebHistory } from 'vue-router'

// Auth
import { useAuthStore } from '@/stores/auth'

// Views
import Contacts from '@/views/Contacts.vue'
import ContactForm from '@/views/ContactForm.vue'
import Account from '@/views/Account.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
    // rotas públicas
    {
        path: '/login',
        component: () => import('@/views/Login.vue'),
        meta: { guest: true }
    },
    {
        path: '/register',
        component: () => import('@/views/Register.vue'),
        meta: { guest: true }
    },
    {
        path: '/forgot-password',
        component: () => import('@/views/ForgotPassword.vue'),
        meta: { guest: true }
    },
    {
        path: '/reset-password/:token',
        component: () => import('@/views/ResetPassword.vue'),
        meta: { guest: true }
    },

    // rotas privadas com layout
    {
        path: '/',
        component: AppLayout,
        meta: { auth: true },
        children: [
            { path: 'contacts',          component: Contacts },
            { path: 'contacts/create',   component: ContactForm },
            { path: 'contacts/:id/edit', component: ContactForm },
            { path: 'account',           component: Account }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router
