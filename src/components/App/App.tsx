import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { socket } from '../../socket';
import { Header } from '../Header/Header';
import { IAuthReducer } from '../Auth/Auth.types';
import { IRootReducer } from '../../reducers/reducers.types';

import { Footer } from '../Footer/Footer';
import UserApi from '../../api/User.api';
import { resetAuthDetails } from '../Auth/Auth.reducer';

import 'react-toastify/dist/ReactToastify.css';
import '../../styles/styles.scss';
import './App.scss';

function App() {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const dispatch = useDispatch();
    const location = useLocation();
    const [socketRefreshInterval, setSocketRefreshInterval] = useState(null);

    useEffect(() => {
        socket.connect();

        if (!socketRefreshInterval) {
            setSocketRefreshInterval(setInterval(async () => {
                if (!socket.connected) {
                    await socket.connect();
                }
            }, 3000));
        }

        const validateLoginState = async () => {
            const response = await (await UserApi.getDetails()).json();

            if (response.code === 401) {
                dispatch(resetAuthDetails());
            }
        }

        if (auth.userId) {
            validateLoginState();
        }

    }, [auth, dispatch, socketRefreshInterval]);

    const inGame = location.pathname.startsWith('/game');

    return (
        <div className={`app ${inGame ? 'in-game' : ''}`}>
            {!inGame && <Header />}
            <div className="content">
                {<Outlet />}
            </div>
            {!inGame && <Footer />}
            <ToastContainer
                autoClose={2000}
                limit={1}
                pauseOnFocusLoss={false}
                theme="dark"
            />
        </div>
    );
}

export default App;
