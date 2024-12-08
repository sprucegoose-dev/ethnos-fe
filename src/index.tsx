import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './reducers/store';
import reportWebVitals from './reportWebVitals';

import App from './components/App/App';
import { LoginForm } from './components/LoginForm/LoginForm';
import { Home } from './components/Home/Home';
import { RoomList } from './components/RoomList/RoomList';
import { Game } from './components/Game/Game';
import { Account } from './components/Account/Account';
import { Matches } from './components/Matches/Matches';
import { Rules } from './components/Rules/Rules';
import { RecentMatches } from './components/RecentMatches/RecentMatches';

import './index.css';

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
                            <Route path="account" element={<Account />} />
                            <Route path="game/:id" element={<Game />} />
                            <Route path="/matches/:username" element={<Matches />} />
                            <Route path="/matches" element={<Matches />} />
                            <Route path="/recent-matches" element={<RecentMatches />} />
                            <Route path="/rules" element={<Rules />} />
                            <Route path="/" element={<Home />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
