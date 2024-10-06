import { useEffect } from 'react';
import './Home.scss';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootReducer } from '../../reducers/reducers.types';
import { IAuthReducer } from '../Auth/Auth.types';

export function Home(): JSX.Element {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = Boolean(auth.userId);

        if (isLoggedIn) {
            navigate('/rooms');
        }
    }, [auth, navigate]);

    return (
        <div className="home">
            <div className="intro">
                <p>
                    Ethnos is a fast-paced area control and set collection game where 2-6 players compete to recruit fantasy creatures
                    and control regions on a map.
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
            <div className="actions">
                <Link to="/login/signUp" className="link-primary">
                    <button className="btn btn-primary btn-block">
                        Sign up
                    </button>
                </Link>
                <Link to="/login" className="link-primary">
                    <button className="btn btn-primary btn-block">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}
