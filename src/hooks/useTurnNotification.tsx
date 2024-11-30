import { useState } from 'react';
import { useSelector } from 'react-redux';

import { IPlayer } from '../components/Game/Game.types';
import { ITurnNotificationState } from '../components/TurnNotification/TurnNotification.types';
import { IAuthReducer } from '../components/Auth/Auth.types';
import { IRootReducer } from '../reducers/reducers.types';

export function useTurnNotification() {
    const [ turnNotificationState, setTurnNotificationState ] = useState<ITurnNotificationState>({
        show: true,
        slideIn: false,
        slideOut: false,
    });
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;

    const handleTurnNotification = (activePlayer: IPlayer, audio: HTMLAudioElement, audioMuted: boolean) => {
        if (activePlayer.user.isBot) {
            setTurnNotificationState({
                show: false,
                slideIn: false,
                slideOut: false
            });
            return;
        }

        if (auth.userId === activePlayer.user.id && audio && !audioMuted) {
            audio.volume = .4;
            audio.play();
        }

        setTurnNotificationState({
            show: true,
            slideIn: true,
            slideOut: false
        });

        setTimeout(() => {
            setTurnNotificationState({
                show: true,
                slideIn: false,
                slideOut: true
            });
        }, 2000);

        setTimeout(() => {
            setTurnNotificationState({
                show: false,
                slideIn: false,
                slideOut: false
            });
        }, 2500);
    }

    const getTurnNotificationText = (player: IPlayer) => {
        const username = player.user.username;
        return `${username}'${username.charAt(username.length - 1) === 's' ? '' : 's'} turn`;
    }

    return {
        getTurnNotificationText,
        handleTurnNotification,
        turnNotificationState
    };
};
