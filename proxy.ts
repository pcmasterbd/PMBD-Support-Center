import { auth } from "./auth"

export const proxy = auth((req) => {
    // Middleware logic is handled by the authorized callback in auth.config.ts
})

export const config = {
    matcher: ['/dashboard/:path*', '/activate', '/expired', '/login', '/register'],
}
