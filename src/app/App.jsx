

import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';
import Login from '../components/login/Login';
import Home from '../pages/Home';
import Contacts from '../pages/Contacts';
import Groups from '../pages/Groups';
import NotFound from '../pages/NotFound';

import classes from './app.module.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className={classes.app}>
      <Header
        onLogout={handleLogout}
        isAuthenticated={Boolean(currentUser)}
      />

      <main>
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={<Navigate to={currentUser ? '/home' : '/login'} replace />}
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/contacts"
            element={
              <RequireAuth>
                <Contacts currentUser={currentUser} />
              </RequireAuth>
            }
          />
          <Route
            path="/groups"
            element={
              <RequireAuth>
                <Groups />
              </RequireAuth>
            }
          />
          <Route
            path="/not-found"
            element={<NotFound />}
          />
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
