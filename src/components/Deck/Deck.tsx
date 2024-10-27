import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';

import { ActionType } from '../Game/Game.types';
import { IDeckProps } from './Deck.types';

import { FacedownCard } from '../FacedownCard/FacedownCard';

import './Deck.scss';

export function Deck(props: IDeckProps): JSX.Element {
    const {
        actions = [],
        activePlayer,
        gameState
    } = props;
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const cardsInDeck = new Array(gameState.cardsInDeckCount).fill(null);

    const selectable = actions.find(action => action.type === ActionType.DRAW_CARD);

    const handleDrawCard = async () => {
        if (activePlayer?.userId === auth.userId) {
            await GameApi.sendAction(gameState.id, { type: ActionType.DRAW_CARD });
        } else {
            toast.info('Please wait for your turn');
        }
    };

    return (
        <div className={`deck ${selectable ? 'selectable' : ''}`} onClick={handleDrawCard}>
            {
                cardsInDeck.map((_card, index) =>
                    <FacedownCard showLogo={!index} key={`facedown-card-${index}`} />
                )
            }
            <span className="total-cards-in-deck">
                {gameState.cardsInDeckCount}
            </span>
        </div>
    );
}
