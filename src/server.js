import 'dotenv';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(process.env.PORT) || 3000;

export async function setupServer() {
  try {
    const app = express();
    app.use(express.json());
    app.use(cors());

    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );

    app.get('/contacts', async (req, res) => {
      const contacts = await getAllContacts();

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    });

    app.get('/contacts/:contactId', async (req, res, next) => {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully found contact with id {contactId}!',
        data: contact,
      });
    });

    app.use('*', (req, res, next) => {
      res.status(404).json({
        status: 404,
        message: 'Not found',
      });
    });

    app.use((err, req, res, next) => {
      res.status(500).json({
        status: 500,
        message: 'Something went wrong',
      });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}