import { IMerfolkTrackProps } from './OrcBoard.types';
import { Color } from '../Game/Shared.types';

import Icon from '../Icon/Icon';

import tokenIcon from '../../assets/tokens/marker_w.webp';

import './OrcBoard.scss';
import { OrcToken } from '../OrcToken/OrcToken';

export function OrcBoard({ player }: IMerfolkTrackProps): JSX.Element {
    const colors = [
        Color.GRAY,
        Color.BLUE,
        Color.RED,
        Color.ORANGE,
        Color.GREEN,
        Color.PURPLE,
    ];

    const orcBoardPoints: {[tokens: number]: number} = {
        1: 1,
        2: 3,
        3: 6,
        4: 10,
        5: 15,
        6: 20,
    };

    return (
        <div className="orc-board-container">
            <div className="orc-board">
                {
                    colors.map(color =>
                        <div
                            key={`square-${color}`}
                            className="square"
                        >
                            <OrcToken
                                className={player.orcTokens.includes(color) ? 'claimed' : ''}
                                color={color}
                                key={`orc-token-${color}`}
                            />
                        </div>
                    )
                }
            </div>
            <table className="table points-chart">
                <thead>
                    <tr>
                        <th className="row-header">
                            <img className="token-icon" src={tokenIcon} alt="Token Icon" />
                        </th>
                        {
                            colors.map((_color, index) =>
                            <th key={`table-header-${index}`}>
                                {index + 1}
                            </th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="row-header">
                            <Icon className="victory-points-icon" icon="wreath" />
                        </td>
                        {
                            Object.values(orcBoardPoints).map((value) =>
                                <td key={`table-cell-${value}`}>
                                    {value}
                                </td>
                            )
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
