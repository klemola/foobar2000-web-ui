import { Failure, Success } from 'runtypes'

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
