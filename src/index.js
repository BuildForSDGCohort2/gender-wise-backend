import '@babel/polyfill';
import express from 'express';
import dotenv from 'dotenv';

import connectDB from './utils/connectdb';
import configureApp from './utils/appconfig';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
configureApp(app);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default { app };
