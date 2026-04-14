export type CFMiddleware = (url: URL, next: () => Promise<Response>, request: Request) => Promise<Response>
export function defineCFMiddleware(fn: CFMiddleware): CFMiddleware {
    return fn
}