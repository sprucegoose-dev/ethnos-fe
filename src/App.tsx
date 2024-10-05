import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { socket } from './socket';
import { Header } from './components/Header/Header';
import { IAuthReducer } from './components/Auth/Auth.types';
import { IRootReducer } from './reducers/reducers.types';

import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';
import './App.scss';
import { LoginForm } from './components/LoginForm/LoginForm';
import { Footer } from './components/Footer/Footer';

function App() {
    const auth = useSelector<IRootReducer>((state) => state.auth) as IAuthReducer;
    const dispatch = useDispatch();

    useEffect(() => {
        socket.connect();

        const validateLoginState = async () => {
            // const response = await (await UserResource.getDetails()).json();

            // if (response.code === 401) {
            //     dispatch(resetAuthDetails());
            // }
        }

        if (auth.userId) {
            validateLoginState();
        }
    }, [auth, dispatch]);

    const { pathname } = useLocation();

    const inGame = pathname.includes('game');

    return (
        <div className="app">
            {inGame ? null : <Header />}
            <div className="content">
                <LoginForm/>
                <Outlet />
            </div>
            {inGame ? null : <Footer />}
            <ToastContainer autoClose={2000} pauseOnFocusLoss={false} />
        </div>
    );
}

export default App;
