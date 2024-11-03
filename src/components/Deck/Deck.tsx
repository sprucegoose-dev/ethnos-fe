import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

import GameApi from '../../api/Game.api';

import { ActionType, CardState, TribeName } from '../Game/Game.types';
import { IDeckProps } from './Deck.types';

import { FacedownCard } from '../FacedownCard/FacedownCard';

import './Deck.scss';
import Icon from '../Icon/Icon';
import dragonImg from '../../assets/dragon_trans_outlined.png';

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

    const revealedDragons = gameState.cards.filter(card =>
        card.tribe.name === TribeName.DRAGON &&
        card.state === CardState.REVEALED
    );

    return (
        <div className={`deck ${selectable ? 'selectable' : ''}`} onClick={handleDrawCard}>
            {
                cardsInDeck.map((_card, index) =>
                    <FacedownCard showLogo={!index} key={`facedown-card-${index}`} />
                )
            }
            {
                revealedDragons.map((dragon, index) =>
                    <img
                        key={`dragon-${dragon.id}`}
                        className={`revealed-dragon dragon-${index + 1}`}
                        src={dragonImg}
                        alt="Revealed Dragon"
                    />
            )}
            <span className="deck-info age">
                AGE {'I'.repeat(gameState.age)}
            </span>
            <span className="deck-info total-cards-in-deck">
                <span className="icons-wrapper">
                    <Icon icon="cards" className="cards-shadow" />
                    <Icon icon="cards" />
                </span>
                <span className="count">{gameState.cardsInDeckCount}</span>
            </span>
        </div>
    );
}
