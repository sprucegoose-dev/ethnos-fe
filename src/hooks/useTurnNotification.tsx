import { useState } from 'react';

import { IPlayer } from '../components/Game/Game.types';
import { ITurnNotificationState } from '../components/TurnNotification/TurnNotification.types';

export function useTurnNotification() {
    const [ turnNotificationState, setTurnNotificationState ] = useState<ITurnNotificationState>({
        show: true,
        slideIn: false,
        slideOut: false,
    });

    const handleTurnNotification = (activePlayer: IPlayer) => {
        if (activePlayer.user.isBot) {
            setTurnNotificationState({
                show: false,
                slideIn: false,
                slideOut: false
            });
            return;
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
