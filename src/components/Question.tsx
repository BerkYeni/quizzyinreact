import React, { useState, MouseEvent, useEffect } from "react";
import QuestionText from "./QuestionText";
import Choice from "./Choice";
import { IApiQuestion, IQuestion } from "../interfaces";

let fetchQuestionsInitiated = false;

const Question: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [score, setScore] = useState<number>(0);

  const defaultQuestion: IQuestion = {
    questionText: "",
    choices: ["", "", "", ""],
    correctAnswer: "default",
    playerAnswer: null,
  };
  const [question, setQuestion] = useState<IQuestion>(defaultQuestion);

  const { questionText, choices, correctAnswer, playerAnswer } = question;

  const fetchQuestions = async () => {
    const response = await fetch("https://the-trivia-api.com/v2/questions");
    const questionsData = await response.json();
    const constructedQuestions = questionsData.map(
      (question: IApiQuestion): IQuestion => {
        const randomIndex = Math.floor(
          Math.random() * question.incorrectAnswers.length
        );
        const choices = question.incorrectAnswers;
        choices.splice(randomIndex, 0, question.correctAnswer);
        return {
          questionText: question.question.text,
          choices: choices,
          playerAnswer: null,
          correctAnswer: question.correctAnswer,
        };
      }
    );
    if (!constructedQuestions) {
      throw new Error("constructed question must not be null");
    }
    setQuestions(constructedQuestions);
    const firstQuestion = constructedQuestions[0];
    if (!firstQuestion) {
      throw new Error("first question must not be null");
    }
    setQuestion(firstQuestion);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!fetchQuestionsInitiated) {
      fetchQuestions();
      fetchQuestionsInitiated = true;
    }
  }, []);

  const handleChoice = (event: MouseEvent, choice: string): void => {
    if (playerAnswer) return;
    if (choice === question.correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }
    setQuestion((previousQuestion) => {
      return { ...previousQuestion, playerAnswer: choice };
    });
  };

  const handleNextQuestion = (): void => {
    setQuestionIndex((previousQuestionIndex) => {
      const newQuestionIndex = previousQuestionIndex + 1;
      const newQuestion = questions[newQuestionIndex];
      if (newQuestion) {
        setQuestion(questions[newQuestionIndex]);
      } else {
        setIsGameOver(true);
      }
      return newQuestionIndex;
    });

    // setQuestion((previousQuestion) => {
    //   const nextQuestionIndex = questions.indexOf(previousQuestion);
    //   console.log(nextQuestionIndex);
    //   console.log(questions[nextQuestionIndex]);
    //   return questions[nextQuestionIndex];
    // });
  };

  const handlePlayAgain = (): void => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  return !isLoaded ? (
    <div className="loading">Loading...</div>
  ) : isGameOver ? (
    <div className="gameOver">
      <div className="finished">Finished!</div>
      <div className="scoreContainer">
        <div className="score">Score: {score}</div>
      </div>
      <div className="playAgain" onClick={handlePlayAgain}>
        Play Again
      </div>
    </div>
  ) : (
    <div className="question">
      <QuestionText questionText={questionText} />
      <div className="choices">
        {choices.map((choice, key) => {
          return (
            <Choice
              onClick={(event) => {
                handleChoice(event, choice);
              }}
              content={choice}
              isCorrect={choice === correctAnswer}
              isChosen={choice === playerAnswer}
              reveal={Boolean(playerAnswer)}
              key={key}
            />
          );
        })}
      </div>
      {playerAnswer && (
        <div className="nextQuestionBtn" onClick={handleNextQuestion}>
          Next Question
        </div>
      )}
    </div>
  );
};

export default Question;
