import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

import { IAgeResultsProps } from './AgeResults.types';

import { PlayerIcon } from '../PlayerIcon/PlayerIcon';
import Icon from '../Icon/Icon';

import './AgeResults.scss';

export function AgeResults(props: IAgeResultsProps): JSX.Element {
    const { gameState } = props;

    return (
        <div className="age-results-container">

            <div className="title">
                Age {'I'.repeat(gameState.age)} - Results
            </div>
            <div className="player-scores">
                {gameState.players.map(player =>
                    <div className="player" key={`player-score-${player.id}`}>
                        <PlayerIcon player={player} />
                        <div className="score">
                            <div className="points"> {player.points}</div>
                            <Icon className="victory-points-icon" icon="wreath" />
                        </div>
                        {player.user.id === gameState.winnerId ?
                            <FontAwesomeIcon className="winner-icon" icon={faCrown} /> : null
                        }
                    </div>
                )}
            </div>
        </div>
    );
}
