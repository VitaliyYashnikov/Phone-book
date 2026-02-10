import Button from '../button/Button';
import avatar from '../../assets/200.jpeg';
import classes from './contacts-list.module.css';

function ContactsList({ contacts = [], isAdmin = false, isLoading = false, error = '', onUpdate, onDelete }) {
    if (isLoading) {
        return <p className={classes.empty}>Loading contacts...</p>;
    }

    if (error) {
        return <p className={classes.empty}>{error}</p>;
    }

    if (!contacts.length) {
        return <p className={classes.empty}>No contacts available yet.</p>;
    }

    return (
        <ul className={classes.list}>
            {contacts.map((contact) => (
                <li key={contact.id || `${contact.name}-${contact.phone}`} className={classes.card}>
                    <img className={classes.avatar} src={avatar} alt="Contact" />
                    <div className={classes.info}>
                        <h3 className={classes.name}>{contact.name}</h3>
                        <p className={classes.meta}>{contact.phone}</p>
                        {contact.email && <p className={classes.meta}>{contact.email}</p>}
                        {contact.address && <p className={classes.meta}>{contact.address}</p>}
                    </div>
                    {isAdmin && (
                        <div className={classes.actions}>
                            <Button
                                text="Update"
                                onClick={() => onUpdate?.(contact)}
                                className={classes.secondary}
                            />
                            <Button
                                text="Delete"
                                onClick={() => onDelete?.(contact)}
                                className={classes.danger}
                            />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default ContactsList;
