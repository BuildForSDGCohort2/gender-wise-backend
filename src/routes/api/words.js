import { Router } from 'express';

import controller from '../../controllers/wordscontroller';
import WordValidation from '../../validation/wordvalidation';

const router = Router();

router.get('/words/word/:word', controller.getSingleWordByWord());
router
  .route('/words/:wordId')
  .get(controller.getSingleWord())
  .put(WordValidation.validatePoll(), controller.voteWords());
router
  .route('/words')
  .get(controller.getWords())
  .post(WordValidation.validateWords(), controller.createNewWord());

router.get('/polls', controller.getPollWords());

router.get('/regex', controller.getRegexString());

export default router;
