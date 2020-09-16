import '@babel/polyfill';
import express from 'express';
import dotenv from 'dotenv';

import connectDB from './utils/connectdb';
import configureApp from './utils/appconfig';
import WordsService from './services/wordsservice';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
configureApp(app);

WordsService.voteCollationOfficer();
WordsService.voteCoordinator();
WordsService.twitterVoteRetriever();

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

export default { app };
