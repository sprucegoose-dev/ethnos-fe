import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import throttle from 'lodash.throttle';
import { useState } from 'react';

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
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    const cardsInMarket = gameState.cards
        .filter(card => card.state === CardState.IN_MARKET)
        .sort((cardA, cardB) => cardA.index - cardB.index);

    const handlePickUpCard = async (card: ICard) => {
        if (activePlayer?.userId === auth.userId) {
            await GameApi.sendAction(gameState.id, { type: ActionType.PICK_UP_CARD, cardId: card.id });
        } else {
            toast.info('Please wait for your turn');
        }
    };

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
