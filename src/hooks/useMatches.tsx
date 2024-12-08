import { IMatch, IMatchesResponse } from '../components/Matches/Matches.types';
import { useEffect, useState } from 'react';
import UserApi from '../api/User.api';
import GameApi from '../api/Game.api';

export function useMatches(username?: string) {
    const [matches, setMatches] = useState<IMatch[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number[]>([]);

    const fetchMatches = async (page: number) => {
        const response = username
            ? await UserApi.getMatches(username, page)
            : await GameApi.getAllMatches(page);

        if (response.ok) {
            const payload: IMatchesResponse = await response.json();
            setMatches(payload.data);
            setPage(page);
            setTotalPages(getTotalPagesArray(payload.pages));
        }
    };

    useEffect(() => {
        fetchMatches(page);
    }, [page, username]);

    const goToPage = async (page: number) => {
        await fetchMatches(page);
    };

    const getTotalPagesArray = (pages: number) =>
        Array.from({ length: pages }, (_, i) => i + 1);

    return {
        page,
        goToPage,
        matches,
        totalPages,
    };
}
