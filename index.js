import dotenv from 'dotenv';
import express from 'express';
import mongoose, { connect } from 'mongoose';
import bodyParser from 'body-parser';
import connectDB from './utils/db.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
await connectDB();


const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' directory

app.use('/api/users', userRoutes);


app.get('/', (req, res) => res.send('multi-vendor-Ecommerece backend practice'));
app.get('/api', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));