import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';

import { IAgeResultsProps } from './AgeResults.types';

import { PlayerIcon } from '../PlayerIcon/PlayerIcon';
import { BandScores } from '../BandScores/BandScores';

import Icon from '../Icon/Icon';

import './AgeResults.scss';
import { CardState, IPlayer, TribeName } from '../Game/Game.types';
import { groupCardsByLeader } from '../Game/helpers';

export function AgeResults(props: IAgeResultsProps): JSX.Element {
    const { gameState } = props;

    const shouldScoreOrcs = gameState.age === 3 &&
        gameState.settings.tribes.includes(TribeName.ORCS);

    const getBandCards = (player: IPlayer) =>
        player.cards.filter(card => card.state == CardState.IN_BAND);

    const calculateAgeTotal = (player: IPlayer) => {
        const {
            bands,
            regions,
            merfolk,
            giants,
            orcs,
        } = player.pointsBreakdown[`${gameState.age}`];

        return (bands || 0) + (regions || 0) + (merfolk || 0) + (giants || 0) + (orcs || 0);
    }

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
            <table className="table scores-breakdown-table">
                <thead>
                    <tr>
                        <th>
                            Player
                        </th>
                        <th>
                           # of Bands
                        </th>
                        <th>
                            Bands (VP)
                        </th>
                        <th>
                            Regions (VP)
                        </th>
                        {gameState.settings.tribes.includes(TribeName.MERFOLK) ?
                            <th>
                                Merfolk (VP)
                            </th> : null
                        }
                        {gameState.settings.tribes.includes(TribeName.GIANTS) ?
                            <th>
                                Giants (VP)
                            </th> : null
                        }
                        {shouldScoreOrcs ?
                            <th>
                                Orcs (VP)
                            </th> : null
                        }
                        <th>
                            Total (VP)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {gameState.players.map(player =>
                       <tr key={`scores-breakdown-${player.id}`}>
                        <td>
                            {player.user.username}
                        </td>
                        <td>
                           {Object.keys(groupCardsByLeader(getBandCards(player))).length}
                        </td>
                        <td>
                            {player.pointsBreakdown[`${gameState.age}`]?.bands || 0}
                        </td>
                        <td>
                            {player.pointsBreakdown[`${gameState.age}`]?.regions || 0}
                        </td>
                        {gameState.settings.tribes.includes(TribeName.MERFOLK) ?
                            <td>
                                {player.pointsBreakdown[`${gameState.age}`]?.merfolk || 0}
                            </td> : null
                        }
                        {gameState.settings.tribes.includes(TribeName.GIANTS) ?
                            <td>
                                {player.pointsBreakdown[`${gameState.age}`]?.giants || 0}
                            </td> : null
                        }
                        {shouldScoreOrcs ?
                            <td>
                                {player.pointsBreakdown[`${gameState.age}`]?.orcs || 0}
                            </td> : null
                        }
                        <td>
                            {calculateAgeTotal(player)}
                        </td>
                       </tr>
                    )}
                </tbody>
            </table>

            {gameState.players.map(player =>
                <BandScores
                    player={player}

                    key={`player-band-scores-${player.id}`}
                />
            )}
        </div>
    );
}
