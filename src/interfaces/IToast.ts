import type { ToastType } from "@/types/Toast"

export default interface Toast {
    id:        number
    type:      ToastType
    message:   string
    expiresAt: number
}