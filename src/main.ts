import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    background: '#121212',
                    surface: '#1E1E1E',
                    primary: '#4CAF50',
                    secondary: '#81C784',
                    accent: '#2E7D32',
                    error: '#E57373',
                    success: '#66BB6A',
                    warning: '#FFB74D',
                },
            },
        },
    },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
