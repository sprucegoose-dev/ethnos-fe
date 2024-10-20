import { IAuthReducer } from '../Auth/Auth.types';
import { IPlayer } from './game.types';

export function getPlayerPositions(currentPlayer: IPlayer, players: IPlayer[]): {[userId: number]: string} {
    const positionsByPlayerCount: {[key: number]: string[]} = {
        2: ['top', 'bottom'],
        3: ['left', 'right', 'bottom'],
        4: ['top', 'left', 'right', 'bottom'],
        5: ['top', 'left-corner', 'right-corner', 'bottom', 'left', 'right'],
        6: ['top', 'left-corner', 'right-corner', 'bottom', 'left', 'right'],
    };

    const playerCount = players.length;
    const positions = positionsByPlayerCount[playerCount] || [];

    if (!currentPlayer || !positions.length) return {};

    const remainingPositions = positions.filter(pos => pos !== 'bottom');

    const playerPosition = { [currentPlayer.userId]: 'bottom' };

    let index = 0;

    for (const player of players) {
        if (player.userId !== currentPlayer.userId) {
            playerPosition[player.userId] = remainingPositions[index++];
        }
    }

    return playerPosition;
};
