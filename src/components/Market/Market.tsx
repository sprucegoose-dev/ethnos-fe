import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';

import { ActionType, CardState } from '../Game/game.types';
import { IDeckProps } from './Market.types';

import { Card } from '../Card/Card';

import './Market.scss';

export function Market({activePlayer, gameState}: IDeckProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const cardsInMarket = gameState.cards
        .filter(card => card.state === CardState.IN_MARKET)
        .sort((cardA, cardB) => cardA.index - cardB.index);

    const handlePickUpCard = async (cardId: number) => {
        if (activePlayer?.userId === auth.userId) {
            await GameApi.sendAction(gameState.id, { type: ActionType.PICK_UP_CARD, cardId });
        } else {
            toast.info('Only the active player can draw a card');
        }
    };

    return (
        <div className="market">
            {
                cardsInMarket.map((card, index) =>
                    <Card
                        onClick={handlePickUpCard}
                        card={card}
                        key={`card-${index}`}
                    />
                )
            }
        </div>
    );
}
