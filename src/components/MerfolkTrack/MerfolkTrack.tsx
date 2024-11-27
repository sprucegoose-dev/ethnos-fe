import { PlayerColor } from '../Game/Game.types';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IMerfolkTrackProps } from './MerfolkTrack.types';

import './MerfolkTrack.scss';
import Icon from '../Icon/Icon';

export function MerfolkTrack({ players }: IMerfolkTrackProps): JSX.Element {
    const checkpoints = [3, 7, 12, 18];

    const squares = Array.from({ length: 19 }, (_, i) => i);
    const invisibleSquares = Array.from({ length: players.length >= 4 ? 2 : 3 }, (_, i) => i);

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
    ];

    const agePoints = (players.length >= 4 ?
        [1, 2, 4] :
        [1, 3]).reverse();

    const renderAgeSquare = (ages: number, points: number, index: number) => {
        return (
            <div
                key={`age-square-${index}`}
                className="square square-age"
            >
                <div className="age">
                    {'I'.repeat(ages - index)}
                </div>
                <span className="number">
                    {points}
                </span>
                <Icon
                    className="victory-points-icon"
                    icon="wreath"
                />
            </div>
        )
    }

    const renderInvisibleSquare = (index: number) => {
        return (
            <div
                key={`invisible-square-${index}`}
                className="square square-invisible"
            >
            </div>
        )
    }

    const renderTrackSquare = (index: number) => {
        return (
            <div
                key={`track-square-${index}`}
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
                    rows.map((row, index) =>
                        <div className="row">
                            {
                                row.map(squareIndex =>
                                    renderTrackSquare(squareIndex)
                                )
                            }
                            {
                                index === rows.length -1 ?
                                    invisibleSquares.map(renderInvisibleSquare) : null
                            }
                            {
                                index === rows.length -1 ?
                                    agePoints.map((points, index) => renderAgeSquare(agePoints.length, points, index)) : null
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}
