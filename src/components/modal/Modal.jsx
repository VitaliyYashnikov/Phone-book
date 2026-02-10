import classes from './modal.module.css';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className={classes.backdrop} onClick={handleBackdropClick}>
            <div
                className={classes.dialog}
                role="dialog"
                aria-modal="true"
                aria-label={title || 'Dialog'}
                onClick={(event) => event.stopPropagation()}
            >
                <div className={classes.header}>
                    {title && <h3 className={classes.title}>{title}</h3>}
                    <button
                        type="button"
                        className={classes.closeButton}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className={classes.content}>{children}</div>
            </div>
        </div>
    );
}

export default Modal;
