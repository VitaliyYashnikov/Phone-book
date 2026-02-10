import { useEffect, useState } from 'react';

import Button from '../components/button/Button';
import CreateContact from '../components/create-contact/CreateContact';
import Modal from '../components/modal/Modal';
import ContactsList from '../components/contacts-list/ContactsList';
import classes from './contacts.module.css';

const API_BASE = 'http://localhost:3001';

function Contacts({ currentUser }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const isAdmin = currentUser?.type === 'admin';

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingContact(null);
        setFormError('');
    };

    const handleOpen = () => {
        setEditingContact(null);
        setFormError('');
        setIsModalOpen(true);
    };

    useEffect(() => {
        const loadContacts = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE}/api/contacts`);
                if (!response.ok) {
                    throw new Error('Failed to load contacts.');
                }
                const data = await response.json();
                setContacts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Failed to load contacts.');
            } finally {
                setIsLoading(false);
            }
        };

        loadContacts();
    }, []);

    const handleCreateContact = async (payload) => {
        setFormError('');
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE}/api/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to save contact.');
            }

            const created = await response.json();
            setContacts((prev) => [created, ...prev]);
            handleClose();
            return true;
        } catch (err) {
            setFormError(err.message || 'Failed to save contact.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateContact = async (payload) => {
        if (!editingContact) {
            return false;
        }

        setFormError('');
        setIsSaving(true);
        try {
            const response = await fetch(`${API_BASE}/api/contacts/${editingContact.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to update contact.');
            }

            const updated = await response.json();
            setContacts((prev) =>
                prev.map((contact) => (contact.id === updated.id ? updated : contact))
            );
            handleClose();
            return true;
        } catch (err) {
            setFormError(err.message || 'Failed to update contact.');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteContact = async (contact) => {
        if (!contact?.id) {
            return;
        }

        setError('');
        try {
            const response = await fetch(`${API_BASE}/api/contacts/${contact.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact.');
            }

            setContacts((prev) => prev.filter((item) => item.id !== contact.id));
        } catch (err) {
            setError(err.message || 'Failed to delete contact.');
        }
    };

    const handleEditClick = (contact) => {
        setEditingContact(contact);
        setFormError('');
        setIsModalOpen(true);
    };

    return (
        <section className={classes.contacts}>
            <div className={classes.header}>
                <h2>Contacts</h2>
                <Button text="Add new contact" onClick={handleOpen} />
            </div>

            <ContactsList
                contacts={contacts}
                isAdmin={isAdmin}
                isLoading={isLoading}
                error={error}
                onUpdate={handleEditClick}
                onDelete={handleDeleteContact}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title={editingContact ? 'Update Contact' : 'Create Contact'}
            >
                <CreateContact
                    initialValues={editingContact}
                    submitLabel={editingContact ? 'Update' : 'Create'}
                    isSubmitting={isSaving}
                    error={formError}
                    onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
                    onCancel={handleClose}
                />
            </Modal>
        </section>
    );
}

export default Contacts;
