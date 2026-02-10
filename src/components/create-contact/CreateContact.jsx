import { useEffect, useState } from 'react';

import Button from '../button/Button';
import classes from './create-contact.module.css';

function CreateContact({ onSubmit, onCancel, initialValues, submitLabel = 'Create', isSubmitting = false, error }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        setName(initialValues?.name || '');
        setPhone(initialValues?.phone || '');
        setEmail(initialValues?.email || '');
        setAddress(initialValues?.address || '');
    }, [initialValues]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim()
        };

        if (onSubmit) {
            const wasSaved = await onSubmit(payload);
            if (wasSaved && !initialValues) {
                setName('');
                setPhone('');
                setEmail('');
                setAddress('');
            }
        }
    };

    return (
        <form className={classes.form} onSubmit={handleSubmit}>
            <label className={classes.label} htmlFor="contact-name">
                Name
            </label>
            <input
                id="contact-name"
                className={classes.input}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Full name"
                required
            />

            <label className={classes.label} htmlFor="contact-phone">
                Phone
            </label>
            <input
                id="contact-phone"
                className={classes.input}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 555 123 4567"
                required
            />

            <label className={classes.label} htmlFor="contact-email">
                Email
            </label>
            <input
                id="contact-email"
                className={classes.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
            />

            <label className={classes.label} htmlFor="contact-address">
                Address
            </label>
            <input
                id="contact-address"
                className={classes.input}
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="City, street"
                required
            />

            {error && <p className={classes.error}>{error}</p>}

            <div className={classes.actions}>
                {onCancel && (
                    <Button
                        text="Cancel"
                        type="button"
                        className={classes.secondary}
                        onClick={onCancel}
                        disabled={isSubmitting}
                    />
                )}
                <Button text={submitLabel} type="submit" disabled={isSubmitting} />
            </div>
        </form>
    );
}

export default CreateContact;
