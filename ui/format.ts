import { Volume } from '../server/Models'

function pad(num: number): string {
    return `${num < 10 ? '0' : ''}${num}`
}

export function formatDuration(ms: number): string {
    if (isNaN(ms)) return '00:00'

    let remaining = ms

    const seconds = Math.floor(remaining % 60)
    remaining /= 60

    const minutes = Math.floor(remaining % 60)
    remaining /= 60

    const hours = Math.floor(remaining % 24)

    return [hours, minutes, seconds]
        .filter((num, i) => num > 0 || i > 0)
        .map(pad)
        .join(':')
}

export function formatVolume(volume: Volume): string {
    if (volume.type === 'muted') {
        return 'Muted.'
    }

    return `${volume.volume} dB`
}
