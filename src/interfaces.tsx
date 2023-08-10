export interface IQuestion {
  questionText: string;
  choices: string[];
  correctAnswer: string;
  playerAnswer: string | null;
}

export type Result = "correct" | "wrong" | "empty";

export interface IQuestionResult {
  question: IQuestion;
  result: Result;
}

export interface IApiQuestion {
  incorrectAnswers: string[];
  correctAnswer: string;
  question: { text: string };
}
