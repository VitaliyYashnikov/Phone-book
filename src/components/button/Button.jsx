import classes from './button.module.css';

function Button({ text, onClick, type = 'button', disabled = false, className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${classes.button} ${className}`.trim()}
        >
            {text}
        </button>
    );
}

export default Button;
