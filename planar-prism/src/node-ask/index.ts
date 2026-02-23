// refactored from https://github.com/intervalia/node-ask/tree/master

import { ConsoleIO } from './io.js';
import { QuestionEngine } from './questions.js';
import type { Question, Answers } from './types.js';

const defaultEngine = new QuestionEngine(new ConsoleIO());

export const ask = (questions: Question[]): Promise<Answers> =>
  defaultEngine.ask(questions);

export const prompt = (message: string): Promise<string> =>
  defaultEngine['prompt'](message);

export const confirm = (message: string): Promise<boolean> =>
  defaultEngine['promptConfirm'](message).then(raw => /^y|yes|ok|true$/i.test(raw));

export const multiline = (message: string): Promise<string> =>
  defaultEngine['promptMultiline'](message);

export { ConsoleIO, QuestionEngine };
export type { Question, Answers };
