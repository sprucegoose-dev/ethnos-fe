import { IGiantTokenProps } from './GiantToken.types';

import Icon from '../Icon/Icon';

import { TribeIcon } from '../TribeIcon/TribeIcon';
import { TribeName } from '../Game/Game.types';
import './GiantToken.scss';

export function GiantToken({ players }: IGiantTokenProps): JSX.Element {
    const agePoints = (players.length >= 4 ?
        [2, 4, 6] :
        [2, 5]);


    const renderAgeSquare = (points: number, index: number) => {
        return (
            <div
                key={`age-square-${index}`}
                className="square square-age"
            >
                <div className="age">
                    {'I'.repeat(index + 1)}
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

    return (
        <div className="giant-token-container">
            <TribeIcon
                showTribeName={false}
                tribe={{ name: TribeName.GIANTS, description: '', id: null }}
            />
            <div className="squares">
                {agePoints.map((points, index) => renderAgeSquare(points, index))}
            </div>
        </div>
    );
}
