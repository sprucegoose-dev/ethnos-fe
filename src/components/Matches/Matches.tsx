import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import UserApi from '../../api/User.api';
import { IMatch, IMatchesProps, IMatchesResponse } from './Matches.types';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';
import './Matches.scss';
import { MatchRow } from '../MatchRow/MatchRow';

export function Matches(_props: IMatchesProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    let username = useParams().username || auth.username;
    const [matches, setMatches] = useState<IMatch[]>([]);
    const navigate = useNavigate();
    const [ page, setPage ] = useState<number>(1);

    useEffect(() => {
        if (!auth.userId) {
            navigate('/login');
            return;
        }

        const getUserMatches = async () => {
            const response = await UserApi.getMatches(username, page);

            if (response.ok) {
                const payload: IMatchesResponse = await response.json();
                setMatches(payload.data);
            }
        };

        getUserMatches();
    }, []);

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
                        <th>
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

        </div>
    );
}
