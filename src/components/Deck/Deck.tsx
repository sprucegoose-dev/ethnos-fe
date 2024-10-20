import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';

import { ActionType, CardState } from '../Game/game.types';
import { IDeckProps } from './Deck.types';

import { FacedownCard } from '../FacedownCard/FacedownCard';

import './Deck.scss';

export function Deck({activePlayer, gameState}: IDeckProps): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const cardsInDeck = gameState.cards
        .filter(card => card.state === CardState.IN_DECK)
        .sort((cardA, cardB) => cardA.index - cardB.index);

    const handleDrawCard = async () => {
        if (activePlayer?.userId === auth.userId) {
            await GameApi.sendAction(gameState.id, { type: ActionType.DRAW_CARD });
        } else {
            toast.info('Only the active player can draw a card');
        }
    };

    return (
        <div className="deck" onClick={handleDrawCard}>
            {
                cardsInDeck.map((_card, index) =>
                    <FacedownCard topCard={!index} key={`facedown-card-${index}`} />
                )
            }
        </div>
    );
}
