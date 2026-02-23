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
