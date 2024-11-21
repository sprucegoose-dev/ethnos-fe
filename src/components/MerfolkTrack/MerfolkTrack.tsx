import { PlayerColor } from '../Game/Game.types';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IMerfolkTrackProps } from './MerfolkTrack.types';

import './MerfolkTrack.scss';

export function MerfolkTrack(props: IMerfolkTrackProps): JSX.Element {
    const checkpoints = [3, 7, 12, 18];

    const { players } = props;

    const squares = Array.from({ length: 19 }, (_, i) => i);

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

    const rows = [
        squares.slice(0, 6),
        squares.slice(6, 12),
        squares.slice(12, 18),
        squares.slice(18, 19),
    ]

    const renderSquare = (index: number) => {
        return (
            <div
                key={`square-${index}`}
                className={`square ${ checkpoints.includes(index) ? 'checkpoint': ''}`}
            >
                <span className="number">
                    {index}
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

    return (
        <div className="merfolk-track-container">
            <div className="merfolk-track">
                {
                    rows.map(row =>
                        <div className="row">
                            {
                                row.map(squareIndex =>
                                    renderSquare(squareIndex)
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}
