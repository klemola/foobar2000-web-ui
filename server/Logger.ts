import winston from 'winston'
import 'winston-daily-rotate-file'

import { Env } from './Models'
export type Logger = winston.Logger

export const create = (
    env: Env = 'production',
    service: string = 'fb2k-web-ui-server'
): Logger => {
    const [fileLogLevel, consoleLogLevel] = Env.match(
        prod => ['info', 'error'],
        dev => ['debug', 'info'],
        test => ['debug', 'error']
    )(env)

    return winston.createLogger({
        format: winston.format.json(),
        defaultMeta: { service },
        transports: [
            new winston.transports.DailyRotateFile({
                filename: `%DATE%-${service}-${env}.log`,
                dirname: 'logs',
                datePattern: 'YYYY-MM-DD',
                maxSize: '10m',
                maxFiles: '3',
                level: fileLogLevel
            }),
            new winston.transports.Console({
                format: winston.format.cli(),
                level: consoleLogLevel
            })
        ]
    })
}
