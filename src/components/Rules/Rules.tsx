import { useEffect, useState } from 'react';

import { BandPointsTable } from '../BandPointsTable/BandPointsTable';
import { Card } from '../Card/Card';
import { ITribe } from '../Game/Game.types';
import { IRulesProps } from './Rules.types';
import TribeApi from '../../api/Tribe.api';
import './Rules.scss';

export function Rules(_props: IRulesProps): JSX.Element {
    const [tribes, setTribes] = useState<ITribe[]>([]);

    useEffect(() => {
        const getTribes = async () => {
            const response = await TribeApi.getAll();
            setTribes(await response.json());
        };

        getTribes();
    }, []);

    const baseUrl = process.env.NODE_ENV === 'production' ?
        `${process.env.REACT_APP_BASE_API_URL_PROD}/api` :
        process.env.REACT_APP_BASE_API_URL_DEV;

    return (
        <div className="rules-container">
            <div className="title">
                Ethnos Rules
                <div className="subtitle">
                    (<a href={`${baseUrl}/ethnos_rules.pdf`} className="link link-primary" target="_blank">Click here for the official rules</a>)
                </div>
            </div>
            <div className="section-title">
                Game Overview
            </div>
            <div className="section-description">
                In Ethnos, 2-6 players compete  to earn the most victory points by collecting sets of fantasy creatures
                 and placing control markers in regions on the board. The game is played over three ages
                 (or two ages in a 2-3 player game).
            </div>
            <div className="section-title">
                Setup
            </div>
            <div className="section-description">
                <ul>
                    <li>
                        Randomly assign three victory point tokens to each region on the board (or two tokens in a 2-3 player game), and arrange them in ascending numerical order.
                    </li>
                    <li>
                        Select 6 Tribes to play with (or 5 in a 2-3 player game).
                    </li>
                    <li>
                        Deal 1 Tribe card to each player.
                    </li>
                    <li>
                        Deal 2 Tribe cards per player into a shared market (e.g. in a 5 player game, the market will have 10 cards).
                    </li>
                    <li>
                        Create a deck from the rest of the cards to form a draw pile.
                    </li>
                    <li>
                        Shuffle the 3 Dragon cards into the bottom half of the deck.
                    </li>
                </ul>
            </div>
            <div className="section-title">
                Gameplay
            </div>
            <div className="section-description">
                Players take turns performing <u>one</u> of the following actions:
                <ul>
                    <li>
                        Draw a card from the deck<sup>*</sup>.
                    </li>
                    <li>
                        Pick up a card from the market<sup>*</sup>.
                    </li>
                    <li>
                        Play a band of cards:
                        <ul>
                            <li>Choose cards from your hand that share the same <strong>color</strong> or <strong>Tribe</strong>.</li>
                            <li>Choose a Leader to activate its special ability.</li>
                            <li>If the band size is greater than the number of tokens in the region matching the leader's color,
                                place a control marker there.
                            </li>
                            <li>
                                Discard unused cards into the market.
                            </li>
                        </ul>
                    </li>
                    <div className="footnote">
                        <sup>*</sup> The hand limit is 10 cards
                    </div>
                </ul>
            </div>
            <div className="section-title">
                Dragon cards
            </div>
            <div className="section-description">
                Three dragons are shuffled into the bottom half of the deck.
                <ul>
                    <li>
                        When a player draws a Dragon, it is set aside and they draw another card.
                    </li>
                    <li>
                        When the third Dragon is revealed, the Age ends immediately.
                    </li>
                </ul>
            </div>
            <div className="section-title">
                Scoring
            </div>
            <div className="section-description">
                At the end of each Age, players gain victory points for the regions they control and the bands they've played.
                <ul>
                    <li>
                        Players with the most control markers in each region earn victory points
                         based on the victory point token for the current Age (and previous Ages for 2nd and 3rd place).
                    </li>
                    <li>
                        Players gain victory points based on the size of each band they've played:
                        <BandPointsTable />
                    </li>
                    <li>
                        Players also gain victory points for the Merfolk Track, Giant Token, and Orc Hoard Board.
                    </li>
                    <li>
                        The player with the most victory points at the end of the third Age wins the game.
                    </li>
                </ul>
            </div>
            <div className="section-title">
                Tribes
            </div>
            <div className="tribes">
                {tribes.map((tribe, index) =>
                    <Card
                        key={`tribe-card-${index}`}
                        // @ts-ignore
                        card={{tribe}}
                    />
                )}
            </div>
        </div>
    );
}
