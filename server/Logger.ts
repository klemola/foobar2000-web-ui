import winston from 'winston'

import { Env } from './Models'
export type Logger = winston.Logger

export const create = (
    env: Env = 'production',
    service: string = 'fb2k-web-ui-server'
): Logger => {
    const logger = winston.createLogger({
        level: env === 'production' ? 'info' : 'debug',
        format: winston.format.json(),
        defaultMeta: { service },
        transports: [
            new winston.transports.File({
                filename: 'error.log',
                level: 'error'
            }),
            new winston.transports.File({
                filename: `${service}-${env}.log`
            })
        ]
    })

    if (env === 'development') {
        logger.add(
            new winston.transports.Console({
                format: winston.format.cli()
            })
        )
    }

    return logger
}
