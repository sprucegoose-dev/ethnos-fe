import { ICard, IPlayer, TribeName } from './Game.types';
import alertSound  from '../../assets/sounds/sound_alert.mp3';

export function sortPlayersByTurnOrder(currentPlayer: IPlayer, players: IPlayer[], turnOrder: number[]): IPlayer[] {
  const targetIndex = turnOrder.indexOf(currentPlayer.id);
  const seatingOrder = turnOrder.slice(targetIndex).concat(turnOrder.slice(0, targetIndex));

  return players.sort((playerA, playerB) => seatingOrder.indexOf(playerA.id) - seatingOrder.indexOf(playerB.id));
}

export function getPlayerPositions(currentPlayer: IPlayer, players: IPlayer[], turnOrder: number[]): {[userId: number]: string} {
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

export function getHighestGiantTokenValue(players: IPlayer[]): number {
    return players
        .sort((playerA, playerB) =>
            playerB.giantTokenValue - playerA.giantTokenValue
        )[0].giantTokenValue;
}

export async function initAudio() {
    const audio = new Audio(alertSound);
    await audio.play();
    audio.pause();
    return audio;
}

export function sortPlayersByBotStatus(players: IPlayer[]) {
    return [
        ...players.filter(player => !player.user.isBot),
        ...players.filter(player => player.user.isBot)
    ];
}

const getBandPoints = (bandSize: number): number => {
    const BAND_VALUES: { [key: number]: number } = {
        1: 0,
        2: 1,
        3: 3,
        4: 6,
        5: 10,
        6: 15
    };

    if (bandSize >= 6) {
        return 15;
    } else {
        return BAND_VALUES[bandSize];
    }
}

export const getBandScore = (cards: ICard[], leaderId: number): number => {
    const filteredCards = cards.filter(card => card.tribe.name !== TribeName.SKELETONS);
    let bandSize = filteredCards.length;
    let leader = filteredCards.find(card => card.id === leaderId);

    if (leader.tribe.name === TribeName.DWARVES) {
        bandSize += 1;
    }

    return getBandPoints(bandSize);
}

export const groupCardsByLeader = (cardsInBands: ICard[]) => {
    return cardsInBands.reduce<{[key: string]: ICard[]}>((acc, card) => {
        if (!acc[card.leaderId]) {
            acc[card.leaderId] = [];
        }
        acc[card.leaderId].push(card);
        return acc;
    }, {});
}
