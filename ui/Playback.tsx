import { h, Component } from 'preact'

import { TrackInfo } from '../server/Models'

export default class Playback extends Component<
    { currentTrack: TrackInfo },
    {}
> {
    render() {
        return (
            <div>
                <h1>Playback</h1>
                <p>{JSON.stringify(this.props.currentTrack)}</p>
            </div>
        )
    }
}
