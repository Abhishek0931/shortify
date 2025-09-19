import dotenv from 'dotenv';
import express from 'express';
import mongoose, { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './utils/db.js';
import userRoutes from './routes/userRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import { redirect } from './controllers/urlController.js';

dotenv.config();
await connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

app.use('/api/users', userRoutes);
app.use('/api/urls', urlRoutes);
app.get('/:code', redirect); 

app.get('/', (req, res) => res.send('shortify backend running...'));
app.get('/api', (req, res) => res.send('API is running...'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;