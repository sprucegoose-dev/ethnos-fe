import './Home.scss';

import { Link } from 'react-router-dom';

export function Home(): JSX.Element {
    return (
        <div className="home">
            <div className="intro">
                <p>
                    Ethnos is a fast-paced area control and set collection game where 2-6 players recruit fantasy creatures
                    and compete to control regions on a map.
                </p>
                <p>
                    The game was designed by Paolo Mori and published by
                    <a href="https://www.cmon.com/" target="_blank" className="link-primary" rel="noreferrer">
                        &nbsp;CMON&nbsp;
                    </a>
                    in 2017, with art by John Howe.
                </p>
                <p>
                    <strong>Ethnos Online</strong> is an unofficial fan-made adaptation of the game.
                    It's completely free to play. All you need to do is
                    <Link to="/login/signUp" className="link-primary">
                        &nbsp;create an account&nbsp;
                    </Link>
                    and you can start playing.
                </p>
                <p>
                    Already have an account? Click
                    <Link to="/rooms" className="link-primary">
                        &nbsp;here&nbsp;
                    </Link>
                    to find a game or create one.
                </p>
            </div>
        </div>
    );
}
