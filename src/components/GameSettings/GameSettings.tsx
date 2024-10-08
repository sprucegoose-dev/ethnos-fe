import { IGameSettingsProps } from './GameSettings.types';
import './GameSettings.scss';

export function GameSettings(props: IGameSettingsProps): JSX.Element {

    return (
        <div className="game-settings">
            <div className="content">
                <div>
                    {props.gameState.maxPlayers}
                </div>
                <div>
                    Tribe Selection
                </div>
                <div>
                    Start game
                </div>
            </div>

        </div>
    );
}
