import { IOrcBoardProps } from './OrcBoard.types';
import { COLORS } from '../Game/Shared.types';

import Icon from '../Icon/Icon';

import tokenIcon from '../../assets/tokens/marker_w.webp';

import './OrcBoard.scss';
import { OrcToken } from '../OrcToken/OrcToken';
import { ORC_BOARD_POINTS } from '../Game/Game.types';

export function OrcBoard({ player }: IOrcBoardProps): JSX.Element {
    return (
        <div className="orc-board-container">
            <div className="orc-board">
                {
                    COLORS.map(color =>
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
                            COLORS.map((_color, index) =>
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
                            Object.values(ORC_BOARD_POINTS).map((value) =>
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
