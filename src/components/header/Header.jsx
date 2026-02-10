
import { NavLink } from 'react-router-dom';

import Button from '../button/Button';
import classes from './header.module.css';

function Header({ onLogout, isAuthenticated }) {
  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/contacts', label: 'Contacts' },
    { path: '/groups', label: 'Groups' }
  ];

  return (
    <header className={classes.header}>
      <div className={classes.brand}>
        <h1>Phone Book</h1>
      </div>

      {isAuthenticated && (
        <nav className={classes.nav} aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${classes.navButton} ${isActive ? classes.active : ''}`.trim()
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      <div className={classes.actions}>
        {isAuthenticated && (
          <Button text="Logout" onClick={onLogout} className={classes.logout} />
        )}
      </div>
    </header>
  );
}

export default Header;
