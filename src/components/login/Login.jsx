import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import Button from '../button/Button';
import users from '../../data/users.json';
import classes from './login.module.css';

const usernamePattern = /^[a-zA-Z0-9._-]{3,20}$/;
const passwordPattern = /^[A-Za-z0-9]{6,20}$/;

const areFieldsFilled = (username, password, confirmPassword) => {
    return (
        username.trim() !== '' &&
        password.trim() !== '' &&
        confirmPassword.trim() !== ''
    );
};

const isPatternValid = (value, pattern) => pattern.test(value);

const isFormValid = (username, password, confirmPassword) => {
    return (
        areFieldsFilled(username, password, confirmPassword) &&
        isPatternValid(username, usernamePattern) &&
        isPatternValid(password, passwordPattern) &&
        password === confirmPassword
    );
};

const validateLogin = (username, password, confirmPassword) => {
    if (!areFieldsFilled(username, password, confirmPassword)) {
        return { ok: false, message: 'Please fill in all fields.' };
    }

    if (!isPatternValid(username, usernamePattern)) {
        return { ok: false, message: 'Username format is invalid.' };
    }

    if (!isPatternValid(password, passwordPattern)) {
        return { ok: false, message: 'Password format is invalid.' };
    }

    if (password !== confirmPassword) {
        return { ok: false, message: 'Passwords do not match.' };
    }

    const matchedUser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (!matchedUser) {
        return { ok: false, message: 'User not found or password is incorrect.' };
    }

    return { ok: true, user: matchedUser };
};

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const isFormComplete = isFormValid(username, password, confirmPassword);

    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage('');
        setMessageType('');

        const validation = validateLogin(username, password, confirmPassword);

        if (!validation.ok) {
            setMessage(validation.message);
            setMessageType('error');
            return;
        }

        setMessage(`Welcome, ${validation.user.name}! (${validation.user.type})`);
        setMessageType('success');
        if (onLogin) {
            onLogin(validation.user);
        }
    };

    const handleFillUser = (user) => {
        setUsername(user.username);
        setPassword(user.password);
        setConfirmPassword(user.password);
    };

    return (
        <section className={classes.login}>
            <h2>Login</h2>
            <form className={classes.form} onSubmit={handleSubmit}>
                <label className={classes.label} htmlFor="login-username">
                    Username
                </label>
                <input
                    id="login-username"
                    className={classes.input}
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                    pattern={usernamePattern.source}
                    title="3-20 characters: letters, numbers, dot, underscore, dash"
                    required
                />

                <label className={classes.label} htmlFor="login-password">
                    Password
                </label>
                <div className={classes.inputWrapper}>
                    <input
                        id="login-password"
                        className={classes.input}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Your password"
                        pattern={passwordPattern.source}
                        title="6-20 characters: letters and numbers"
                        required
                    />
                    <button
                        type="button"
                        className={classes.iconButton}
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>

                <label className={classes.label} htmlFor="login-confirm-password">
                    Confirm Password
                </label>
                <div className={classes.inputWrapper}>
                    <input
                        id="login-confirm-password"
                        className={classes.input}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repeat password"
                        pattern={passwordPattern.source}
                        title="Repeat the same password"
                        required
                    />
                    <button
                        type="button"
                        className={classes.iconButton}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>

                <Button text="Login" type="submit" disabled={!isFormComplete} />
            </form>

            {message && (
                <p
                    className={`${classes.message} ${messageType === 'error' ? classes.error : classes.success
                        }`}
                >
                    {message}
                </p>
            )}

            <div className={classes.testUsers}>
                <h3 className={classes.testTitle}>Test Users</h3>
                <ul className={classes.userList}>
                    {users.map((user) => (
                        <li key={user.username} className={classes.userItem}>
                            <div className={classes.userInfo}>
                                <span className={classes.userName}>{user.name}</span>
                                <span className={classes.userMeta}>
                                    {user.username} · {user.type}
                                </span>
                                <span className={classes.userPassword}>
                                    Password: {user.password}
                                </span>
                            </div>
                            <button
                                type="button"
                                className={classes.fillButton}
                                onClick={() => handleFillUser(user)}
                            >
                                Use
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default Login;
