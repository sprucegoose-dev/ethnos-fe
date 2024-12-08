import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { IMatchesProps } from './Matches.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import { MatchRow } from '../MatchRow/MatchRow';
import Paginator from '../Paginator/Paginator';
import { useMatches } from '../../hooks/useMatches';
import './Matches.scss';

export function Matches(_props: IMatchesProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    let username = useParams().username || auth.username;
    const {
        page,
        matches,
        goToPage,
        totalPages,
    } = useMatches(username);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.userId) {
            navigate('/login');
            return;
        }
    }, [auth, navigate]);

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
