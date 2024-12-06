import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import throttle from 'lodash.throttle';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';

import { CardState, ICard } from '../Game/Game.types';
import { ActionType } from '../Game/Action.types';
import { IDeckProps } from './Market.types';

import { Card } from '../Card/Card';

import './Market.scss';

export function Market({activePlayer, gameState}: IDeckProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number>(null);
    const [submitting, setSubmitting] = useState<boolean>(null);

    const cardsInMarket = gameState.cards
        .filter(card => card.state === CardState.IN_MARKET)
        .sort((cardA, cardB) => cardA.index - cardB.index);

    const handlePickUpCard = throttle(async (card: ICard) => {
        if (submitting) {
            return;
        }

        setSubmitting(true);

        if (activePlayer?.userId === auth.userId) {
            const response = await GameApi.sendAction(gameState.id, { type: ActionType.PICK_UP_CARD, cardId: card.id });


            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            }
        } else {
            toast.info('Please wait for your turn');
        }

        setSubmitting(false);
    }, 500);

    const calculateClass = (index: number) => {
        return hoveredCardIndex === index ? 'hover' :  '';
    };

    const calculateCardStyle = () => {
        let resolvedCardCount = cardsInMarket.length < 10 ? 10 : cardsInMarket.length;

        return { width: `${(100 / resolvedCardCount)}%`, minWidth: `${(100 / resolvedCardCount)}%` }
    };

    const handleMouseEnter = throttle((index: number) => {
        setHoveredCardIndex(index);
    }, 1000);

    const handleMouseLeave = throttle(() => {
        setHoveredCardIndex(null);
    }, 1000);

    useEffect(() => {
        setHoveredCardIndex(null);
    }, [cardsInMarket.length]);

    return (
        <div className="market">
            {
                cardsInMarket.map((card, index) =>
                    <div
                        className={`card-wrapper ${calculateClass(index)}`}
                        style={calculateCardStyle()}
                        key={`card-${index}`}
                    >
                        <Card
                            onSelect={handlePickUpCard}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            card={card}
                        />
                    </div>
                )
            }
        </div>
    );
}
