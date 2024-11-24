import { useEffect, useRef, useState } from 'react';
import { CardState, IGameState, TribeName } from '../components/Game/Game.types';

export function useDragonOverlay(gameState: IGameState) {
    const [showDragonOverlay, setShowDragonOverlay] = useState<boolean>(false);
    const prevRevealedDragonsCount = useRef(0);
    const prevAge = useRef(gameState?.age || 1);

    const revealedDragonsCount = gameState?.cards.filter(card =>
        card.tribe.name === TribeName.DRAGON &&
        card.state === CardState.REVEALED
    )?.length ?? null;

    const age = gameState?.age;

    useEffect(() => {
        if (revealedDragonsCount === null) {
            return;
        }

        if (prevRevealedDragonsCount.current === 0 && revealedDragonsCount !== 0) {
            prevRevealedDragonsCount.current = revealedDragonsCount;
            return;
        }

        if (revealedDragonsCount > prevRevealedDragonsCount.current) {
            setShowDragonOverlay(true);

            setTimeout(() => {
                setShowDragonOverlay(false);
            }, 2000);

            prevRevealedDragonsCount.current = revealedDragonsCount;
        }
    }, [revealedDragonsCount]);

    useEffect(() => {
        if (age > prevAge.current) {
            prevAge.current = age;
            prevRevealedDragonsCount.current = null;
            return;
        }
    }, [age]);

    return {
        showDragonOverlay,
    };
};
