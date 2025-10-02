import { useToastStore } from '@/stores/toast'

export function handleApiError(err: any) {
    const toast = useToastStore()

    const hiddenFields = ['latitude', 'longitude']

    if (err && typeof err === 'object' && ('message' in err || 'errors' in err)) {
        if (err.message) {
            toast.error(err.message)
        }

        if (err.errors) {
            Object.entries(err.errors).forEach(([field, msgs]) => {
                // Ignora os campos ocultos
                if (hiddenFields.includes(field)) return

                if (Array.isArray(msgs)) {
                    msgs.forEach(m => toast.error(`${m}`))
                } else if (typeof msgs === 'string') {
                    toast.error(msgs)
                }
            })
        }

        return
    }

    // Erros genéricos (por ex.: network)
    if (err?.response?.data) {
        // em caso de Axios ou fetch com response.data
        handleApiError(err.response.data)
        return
    }

    // Fallback
    toast.error(typeof err === 'string' ? err : 'Ocorreu um erro inesperado.')
}
