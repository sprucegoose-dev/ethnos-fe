import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IRecentMatchesProps } from './RecentMatches.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { MatchRow } from '../MatchRow/MatchRow';
import Paginator from '../Paginator/Paginator';
import { useMatches } from '../../hooks/useMatches';

import './RecentMatches.scss';

export function RecentMatches(_props: IRecentMatchesProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    let username = useParams().username || auth.username;
    const {
        page,
        matches,
        goToPage,
        totalPages,
    } = useMatches();

    if (!auth.userId) {
        <div>
            You must be logged in to see recent matches,
        </div>
    }

    return (
        <div className="matches-container">
            <div className="title">
                {username}
            </div>
            <table className="table matches-table">
                <thead>
                    <tr>
                        <th>
                            Date
                        </th>
                        <th className="hide-mobile">
                            Room Name
                        </th>
                        <th className="players-header">
                            Players
                        </th>
                        <th>
                            Tribes
                        </th>
                        <th>
                            Winner
                        </th>
                        <td>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {
                        matches.map(match =>
                            <MatchRow match={match} key={`match-row-${match.id}`} />
                        )
                    }
                </tbody>
            </table>
            <Paginator
                currentPage={page}
                onGoToPageCallback={goToPage}
                pages={totalPages}
            />
        </div>
    );
}
