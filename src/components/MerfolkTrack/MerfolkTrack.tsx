import { PlayerColor } from '../Game/Game.types';
import { TokenIcon } from '../TokenIcon/TokenIcon';
import { IMerfolkTrackProps } from './MerfolkTrack.types';

export function MerfolkTrack(props: IMerfolkTrackProps): JSX.Element {
    const checkpoints = [3, 7, 12, 18];

    const { players } = props;

    const squares = Array.from({ length: 18 }, (_, i) => i);

    const playersByPoints = players.reduce<{ [key: number]: PlayerColor }>(
        (acc, player) => {
          acc[player.merfolkTrackScore] = player.color;
          return acc;
        },
        {}
    );
    return (
        <div className="merfolk-board">
            {
                squares.map((_square, index) =>
                    <div className="square">
                        <span className="number">
                            {index + 1}
                        </span>
                        {
                        checkpoints.includes(index + 1) ?
                            <div className="checkpoint"></div> : null
                        }
                        {playersByPoints[index] ?
                            <TokenIcon color={playersByPoints[index]} /> : null
                        }
                    </div>
                )
            }
        </div>
    );
}
