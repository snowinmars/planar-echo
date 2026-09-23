/*
 * Refactored from intervalia/node-ask.
 * Copyright (c) 2014-2015 Michael Glen Collins. MIT License.
 * See THIRD_PARTY_NOTICES.md for source and license details.
 */

export interface Answer {
  key: string;
  value: string | boolean;
}

export interface Question {
  key: string;
  message: string;
  type: 'prompt' | 'confirm' | 'multiline';
  validate?: (value: string) => boolean | Promise<boolean>;
  transform?: (value: string) => string | boolean;
}

export interface Answers {
  [key: string]: string | boolean;
}
