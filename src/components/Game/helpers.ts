import { IPlayer } from './Game.types';

export function sortPlayersByTurnOrder(currentPlayer: IPlayer, players: IPlayer[], turnOrder: number[]) {
    const otherPlayers = players.filter(player => player.id !== currentPlayer.id)
        .sort((playerA, playerB) =>
            turnOrder.indexOf(playerA.id) - turnOrder.indexOf(playerB.id)
    );

    return [currentPlayer, ...otherPlayers];
}

export function getPlayerPositions(currentPlayer: IPlayer, players: IPlayer[], turnOrder:number[]): {[userId: number]: string} {
    const sortedPlayers = sortPlayersByTurnOrder(currentPlayer, players, turnOrder);

    const positionsByPlayerCount: {[key: number]: string[]} = {
        2: ['bottom', 'top'],
        3: ['bottom', 'left', 'right'],
        4: ['bottom', 'left', 'top', 'right'],
        5: ['bottom', 'left', 'left-corner', 'right-corner', 'right'],
        6: ['bottom', 'left', 'left-corner', 'top', 'right-corner', 'right'],
    };

    const playerCount = sortedPlayers.length;
    const positions = positionsByPlayerCount[playerCount] || [];

    if (!currentPlayer || !positions.length) return {};

    const remainingPositions = positions.filter(pos => pos !== 'bottom');

    const playerPosition = { [currentPlayer.userId]: 'bottom' };

    let index = 0;

    for (const player of sortedPlayers) {
        if (player.userId !== currentPlayer.userId) {
            playerPosition[player.userId] = remainingPositions[index++];
        }
    }

    return playerPosition;
};
