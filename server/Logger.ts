import winston from 'winston'

import { Env } from 'Models'

export type Logger = winston.Logger

export const create = (env: Env = 'production'): Logger => {
    const logger = winston.createLogger({
        level: env === 'production' ? 'info' : 'debug',
        format: winston.format.json(),
        defaultMeta: { service: 'fb2k-web-ui' },
        transports: [
            new winston.transports.File({
                filename: 'error.log',
                level: 'error'
            }),
            new winston.transports.File({ filename: `fb2k-web-ui-${env}.log` })
        ]
    })

    if (env === 'development') {
        logger.add(
            new winston.transports.Console({
                format: winston.format.simple()
            })
        )
    }

    return logger
}
