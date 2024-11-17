import { PlayerColor } from '../Game/Game.types';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IMerfolkTrackProps } from './MerfolkTrack.types';

import './MerfolkTrack.scss';

export function MerfolkTrack(props: IMerfolkTrackProps): JSX.Element {
    const checkpoints = [3, 7, 12, 18];

    const { players } = props;

    const squares = Array.from({ length: 18 }, (_, i) => i);

    const playersByPoints = players.reduce<{ [key: number]: PlayerColor[] }>(
        (acc, player) => {

            if (acc[player.merfolkTrackScore]) {
                acc[player.merfolkTrackScore].push(player.color)
            } else {
                acc[player.merfolkTrackScore] = [player.color];
            }
          return acc;
        },
        {}
    );

    return (
        <div className="merfolk-track-container">
            <div className="merfolk-track">
                {
                    squares.map((_square, index) =>
                        <div
                            key={`square-${index}`}
                            className={`square ${ checkpoints.includes(index + 1) ? 'checkpoint': ''}`}
                        >
                            <span className="number">
                                {index + 1}
                            </span>
                            <div className="player-tokens">
                                {playersByPoints[index] ?
                                    playersByPoints[index].map(playerColor =>
                                        <TokenIcon color={playerColor} key={`token-icon-${playerColor}`}/>
                                    )
                                    : null
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
