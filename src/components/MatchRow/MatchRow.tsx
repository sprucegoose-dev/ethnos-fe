import { Link } from 'react-router-dom';
import moment from 'moment';

import { renderRoomName } from '../Game/helpers';
import { IMatchRowProps } from './MatchRow.types';
import { IMatch } from '../Matches/Matches.types';
import { PlayerIcon } from '../PlayerIcon/PlayerIcon';
import { TribeIcon } from '../TribeIcon/TribeIcon';
import './MatchRow.scss';

export function MatchRow(props: IMatchRowProps): JSX.Element {
    const { match } = props;

    const formatDate = (date: string) =>
        moment(date).local().format('YYYY/MM/DD H:mm');

    const formatRoomName = (match: IMatch) => {
        const creatorUsername = match.players.find(player => player.user.id === match.creatorId).user.username;
        return renderRoomName(creatorUsername);
    };

    const getWinner = (match: IMatch) =>
        match.players.find(player => player.user.id === match.winnerId);

    const tribeRows = [
        match.settings.tribes.slice(0, 3),
        match.settings.tribes.slice(3),
    ];

    const playerRows = match.players.length > 4 ?
        [
            match.players.slice(0, 3),
            match.players.slice(3),
        ] : [match.players];

    return (
        <tr className="match-row" key={`match-row-${match.id}`}>
            <td>
                {formatDate(match.createdAt)}
            </td>
            <td className="hide-mobile">
                {formatRoomName(match)}
            </td>
            <td className="players-cell">
                {playerRows.map((playerRow, index) =>
                   <div className="players-row"  key={`match-${match.id}-players-row-${index}`}>
                        {playerRow.map(player =>
                            <PlayerIcon
                                key={`match-${match.id}-player-${player.id}`}
                                player={player}
                            />
                        )}
                    </div>
                )}
            </td>
            <td>
                {tribeRows.map((tribeRow, index) =>
                   <div className="tribes-row"  key={`match-${match.id}-tribes-row-${index}`}>
                        {tribeRow.map(tribeName =>
                            <TribeIcon
                                key={`match-${match.id}-tribe-${tribeName}`}
                                tribe={{name: tribeName, description: '', id: null }}
                                showTribeName={false}
                            />
                        )}
                    </div>
                )}
            </td>
            <td>
                {
                    getWinner(match) ?
                        <PlayerIcon
                            player={getWinner(match)}
                        /> : null
                }
            </td>
            <td>
                <Link to={`/game/${match.id}`}>
                    <button className="btn btn-action btn-3d">
                        View
                    </button>
                </Link>
            </td>
        </tr>
    );
}
