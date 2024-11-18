import { CardState, ICard } from '../Game/Game.types';
import { IBandsProps } from './Bands.types';

import { Band } from '../Band/Band';

import './Bands.scss';

export function Bands(props: IBandsProps): JSX.Element {
    const {
        player,
    } = props;

    const cardsInBands = player.cards.filter(card =>
        card.state === CardState.IN_BAND
    );

    const groupedByLeader = cardsInBands.reduce<{[key: string]: ICard[]}>((acc, card) => {
        if (!acc[card.leaderId]) {
            acc[card.leaderId] = [];
        }
        acc[card.leaderId].push(card);
        return acc;
    }, {});

    return (
        <div className="bands-container">
            <div className="bands">
                {Object.entries(groupedByLeader).map(([leaderId, cards]) => (
                    <Band
                        key={`band-${leaderId}`}
                        cards={cards}
                        leaderId={Number(leaderId)}
                    />
                ))}
            </div>
        </div>
    );
}
