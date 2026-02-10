import cors from 'cors';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'src', 'data', 'contacts.json');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const readContacts = async () => {
    try {
        const raw = await fs.readFile(dataPath, 'utf-8');
        if (!raw.trim()) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeContacts = async (contacts) => {
    const data = JSON.stringify(contacts, null, 2);
    await fs.writeFile(dataPath, `${data}\n`, 'utf-8');
};

app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await readContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to read contacts.' });
    }
});

app.post('/api/contacts', async (req, res) => {
    const { name, phone, email = '', address = '' } = req.body || {};

    if (!name || !phone) {
        res.status(400).json({ message: 'Name and phone are required.' });
        return;
    }

    try {
        const contacts = await readContacts();
        const newContact = {
            id: Date.now().toString(36),
            name: String(name).trim(),
            phone: String(phone).trim(),
            email: String(email).trim(),
            address: String(address).trim()
        };

        contacts.unshift(newContact);
        await writeContacts(contacts);

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save contact.' });
    }
});

app.put('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, email = '', address = '' } = req.body || {};

    if (!name || !phone) {
        res.status(400).json({ message: 'Name and phone are required.' });
        return;
    }

    try {
        const contacts = await readContacts();
        const index = contacts.findIndex((contact) => contact.id === id);

        if (index === -1) {
            res.status(404).json({ message: 'Contact not found.' });
            return;
        }

        const updated = {
            ...contacts[index],
            name: String(name).trim(),
            phone: String(phone).trim(),
            email: String(email).trim(),
            address: String(address).trim()
        };

        contacts[index] = updated;
        await writeContacts(contacts);

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update contact.' });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const contacts = await readContacts();
        const index = contacts.findIndex((contact) => contact.id === id);

        if (index === -1) {
            res.status(404).json({ message: 'Contact not found.' });
            return;
        }

        const [removed] = contacts.splice(index, 1);
        await writeContacts(contacts);

        res.json({ id: removed.id });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete contact.' });
    }
});

app.listen(port, () => {
    console.log(`Contacts API running on http://localhost:${port}`);
});
