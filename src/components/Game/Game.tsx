import { useEffect, useState } from 'react';

import './Game.scss';
import { GameState, IActionPayload, IGameState } from './game.types';
import GameApi from '../../api/Game.api';
import { socket } from '../../socket';
import { useParams } from 'react-router-dom';
import { GameSettings } from '../GameSettings/GameSettings';

// import centaurIcon from '../../assets/circle_icon_centaur.png';
// import dwarfIcon from '../../assets/circle_icon_dwarf.png';
// import elfIcon from '../../assets/circle_icon_elf.png';
// import giantIcon from '../../assets/circle_icon_giant.png';
// import halflingIcon from '../../assets/circle_icon_halfling.png';
// import merfolkIcon from '../../assets/circle_icon_merfolk.png';
// import minotaurIcon from '../../assets/circle_icon_minotaur.png';
// import orcIcon from '../../assets/circle_icon_orc.png';
// import skeletonIcon from '../../assets/circle_icon_skeleton.png';
// import trollIcon from '../../assets/circle_icon_troll.png';
// import wingfolkIcon from '../../assets/circle_icon_wingfolk.png';
// import wizardIcon from '../../assets/circle_icon_wizard.png';

// const tribeCards = {
//     [TribeName.CENTAUR]: centaurIcon,
//     [TribeName.DWARF]: dwarfIcon,
//     [TribeName.ELF]: elfIcon,
//     [TribeName.GIANT]: giantIcon,
//     [TribeName.HALFLING]: halflingIcon,
//     [TribeName.MERFOLK]: merfolkIcon,
//     [TribeName.MINOTAUR]: minotaurIcon,
//     [TribeName.ORC]: orcIcon,
//     [TribeName.SKELETON]: skeletonIcon,
//     [TribeName.TROLL]: trollIcon,
//     [TribeName.WINGFOLK]: wingfolkIcon,
//     [TribeName.WIZARD]: wizardIcon,
// };

const {
    CREATED,
    ENDED,
    CANCELLED,
    STARTED,
} = GameState;

export function Game(): JSX.Element {
    const { id: gameId } = useParams();
    const [gameState, setGameState] = useState<IGameState>(null);
    const [ _actions, setActions ] = useState<IActionPayload[]>([]);

    useEffect(() => {
        const getGameState = async () => {
            const response = await GameApi.getState(Number(gameId));
            setGameState(await response.json());
        }

        const getActions = async () => {
            const response = await GameApi.getActions(parseInt(gameId, 10));
            setActions(await response.json());
        }

        getGameState();

        const updateGameState = (payload: IGameState) => {
            setGameState(payload);
            getActions();
        }

        socket.emit('onJoinGame', gameId);
        socket.on('onUpdateGameState', updateGameState);

        return () => {
            socket.emit('onLeaveGame', gameId);
            socket.off('onUpdateGameState', updateGameState);
        }
    }, [gameId]);

    return (
        <div className="game-container">
            {gameState?.state === CREATED ?
                <GameSettings gameState={gameState} /> : null
            }
            {[STARTED, ENDED, CANCELLED].includes(gameState?.state) ?
                <div className="game">
                    Game
                </div> : null
            }
        </div>
    );
}
