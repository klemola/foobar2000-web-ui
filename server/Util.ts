import * as os from 'os'
import { Failure, Success } from 'runtypes'

export function getIPv4AddressList() {
    const eligibleInterfaces = os.networkInterfaces()['Local Area Connection']

    if (!eligibleInterfaces) {
        return []
    }

    return eligibleInterfaces
        .filter(i => i.family === 'IPv4')
        .map(i => i.address)
}

export const failure = (message: string): Failure => ({
    success: false,
    message
})

export const success = <T>(value: T): Success<T> => ({
    success: true,
    value
})

export const mapSuccess = <T, A>(
    s: Success<T>,
    fn: (curr: T) => A
): Success<A> => ({
    ...s,
    value: fn(s.value)
})
