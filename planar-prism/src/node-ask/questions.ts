import { ConsoleIO } from './io.js';

import type { Question, Answers } from './types.js';

export class QuestionEngine {
  constructor(private io: ConsoleIO) {}

  async ask(questions: Question[]): Promise<Answers> {
    const answers: Answers = {};

    for (const q of questions) {
      const value = await this.askOne(q, answers);
      answers[q.key] = value;
    }

    return answers;
  }

  private async askOne(question: Question, existingAnswers: Answers): Promise<string | boolean> {
    const { message, type, validate, transform } = question;

    let rawValue: string;

    switch (type) {
      case 'confirm':
        rawValue = await this.promptConfirm(message);
        break;
      case 'multiline':
        rawValue = await this.promptMultiline(message);
        break;
      default: // prompt
        rawValue = await this.prompt(message);
    }

    if (validate) {
      const isValid = await validate(rawValue);
      if (!isValid) {
        this.io.write('Invalid input. Please try again.\n');
        return this.askOne(question, existingAnswers);
      }
    }

    if (transform) {
      return transform(rawValue);
    }

    if (type === 'confirm') {
      return /^y|yes|ok|true$/i.test(rawValue);
    }

    return rawValue;
  }

  private async prompt(message: string): Promise<string> {
    this.io.write(message);
    return this.io.readLine();
  }

  private async promptConfirm(message: string): Promise<string> {
    this.io.write(`${message} (y/n) `);
    return this.io.readLine();
  }

  private async promptMultiline(message: string): Promise<string> {
    this.io.write(message);
    this.io.write(' (enter empty line to finish)');
    return this.io.readMultiline();
  }
}
