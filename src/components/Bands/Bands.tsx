import { CardState, ICard } from '../Game/Game.types';
import { IBandsProps } from './Bands.types';

import { Band } from '../Band/Band';

import './Bands.scss';
import { groupCardsByLeader } from '../Game/helpers';

export function Bands(props: IBandsProps): JSX.Element {
    const {
        player,
        showBandScore,
    } = props;

    const cardsInBands = player.cards.filter(card =>
        card.state === CardState.IN_BAND
    );

    const groupedByLeader = groupCardsByLeader(cardsInBands);

    return (
        <div className="bands-container">
            <div className="bands">
                {Object.entries(groupedByLeader).map(([leaderId, cards]) => (
                    <Band
                        key={`band-${leaderId}`}
                        cards={cards}
                        leaderId={Number(leaderId)}
                        showBandScore={showBandScore}
                    />
                ))}
            </div>
        </div>
    );
}
