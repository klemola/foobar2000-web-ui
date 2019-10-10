import { h, FunctionalComponent } from 'preact'

import { TrackInfo } from '../server/Models'

interface Props {
    track: TrackInfo
    className?: string
}

const TrackDetails: FunctionalComponent<Props> = (props: Props) => {
    const { track } = props
    const trackDuration = `${track.secondsPlayed} / ${track.trackLength}`
    const className = props.className || ''

    return track.state === 'stopped' ? (
        <div className={`track-details--stopped ${className}`}>Stopped.</div>
    ) : (
        <div className={`track-details ${className}`}>
            <div className="track-details__time">{trackDuration}</div>
            <ul className="track-details__info">
                <li className="track-details__info__track">{track.track}</li>
                <li className="track-details__info__artist">{track.artist}</li>
                <li className="track-details__info__album">{track.album}</li>
            </ul>
        </div>
    )
}

export default TrackDetails
