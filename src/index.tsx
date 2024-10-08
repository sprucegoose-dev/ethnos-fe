import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from './reducers/store';

import './index.css';
import { LoginForm } from './components/LoginForm/LoginForm';
import { Home } from './components/Home/Home';
import { RoomList } from './components/RoomList/RoomList';
import { Game } from './components/Game/Game';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route path="login/:signUp" element={<LoginForm />} />
                            <Route path="login" element={<LoginForm />} />
                            <Route path="rooms" element={<RoomList />} />
                            <Route path="/" element={<Home />} />
                        </Route>
                        <Route path="game/:id" element={<Game />} />
                    </Routes>
                </BrowserRouter>
            </PersistGate>
    </Provider>,
  </React.StrictMode>
);

reportWebVitals();
