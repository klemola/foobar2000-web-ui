import { h, FunctionalComponent } from 'preact'

import { TrackInfo } from '../server/Models'
import { formatDuration } from './format'

interface Props {
    trackInfo: TrackInfo
    className?: string
}

const TrackDetails: FunctionalComponent<Props> = (props: Props) => {
    const { trackInfo } = props
    const trackDuration = `${formatDuration(
        trackInfo.secondsPlayed
    )} / ${formatDuration(trackInfo.trackLength)}`
    const className = props.className || ''

    return trackInfo.state === 'stopped' ? (
        <div className={`track-details--stopped ${className}`}>Stopped.</div>
    ) : (
        <div className={`track-details ${className}`}>
            <ul className="track-details__info">
                <li className="track-details__info__artist">
                    {trackInfo.artist}
                </li>
                <li className="track-details__info__album">
                    {trackInfo.album}
                </li>
                <li className="track-details__info__track">
                    <span className="track-details__info__track__number">
                        {trackInfo.trackNumber}
                    </span>
                    <span>{trackInfo.track}</span>
                </li>
            </ul>
            <div className="track-details__time">{trackDuration}</div>
        </div>
    )
}

export default TrackDetails
