import { CardState, ICard } from '../Game/Game.types';
import { IBandsProps } from './Bands.types';

import { Band } from '../Band/Band';

import './Bands.scss';
import { groupCardsByLeader } from '../Game/helpers';

export function Bands(props: IBandsProps): JSX.Element {
    const {
        player,
        showBandScore = false,
        showPointsTable = true,
    } = props;

    const cardsInBands = player.cards.filter(card =>
        card.state === CardState.IN_BAND
    );

    const groupedByLeader = groupCardsByLeader(cardsInBands);

    const bandValues: { [key: number]: number } = {
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
        6: 15
    };

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
            {showPointsTable ?
                <table className="table band-points-table">
                    <thead>
                        <tr>
                            <th className="row-header">
                                Band Size
                            </th>
                            {
                                Object.keys(bandValues).map((bandSize) =>
                                    <th key={`table-header-${bandSize}`}>
                                        {bandSize}{Number(bandSize) === 6 ? '+' : ''}
                                    </th>
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="row-header">
                                Points
                            </td>
                            {
                                Object.values(bandValues).map((points) =>
                                    <th key={`table-header-${points}`}>
                                        {points}
                                    </th>
                                )
                            }
                        </tr>
                    </tbody>
                </table> : null
            }
        </div>
    );
}
