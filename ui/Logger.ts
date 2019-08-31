export type Logger = {
    info: (message: string, data: any) => void
    debug: (message: string, data: any) => void
    error: (message: string, error?: Error) => void
}

export const create = (): Logger => {
    const logger = {
        info: (message: string, data: any) => console.info(message, data),
        debug: (message: string, data: any) => console.debug(message, data),
        error: (message: string, error?: Error) => console.error(message, error)
    }

    return logger
}
