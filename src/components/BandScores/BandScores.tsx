import { PlayerIcon } from '../PlayerIcon/PlayerIcon';

import { Bands } from '../Bands/Bands';
import { IBandScoresProps } from './BandScores.types';
import './BandScores.scss';

export function BandScores(props: IBandScoresProps): JSX.Element {
    const {
        player,
    } = props;

    return (
        <div className="band-scores" key={`band-scores-${player.id}`}>
            <PlayerIcon player={player} />
            <Bands player={player} showBandScore={true} />
        </div>
    );
}
