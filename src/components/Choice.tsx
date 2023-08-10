import React, { MouseEventHandler } from "react";

interface ChoiceProps {
  content: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isCorrect: boolean;
  isChosen: boolean;
  reveal: boolean;
}

const Choice: React.FC<ChoiceProps> = ({
  content,
  onClick,
  isChosen,
  isCorrect,
  reveal,
}: ChoiceProps) => {
  return (
    <div
      onClick={onClick}
      className={`choice ${
        isChosen
          ? isCorrect
            ? "correctPlayerAnswer"
            : "wrongPlayerAnswer"
          : ""
      } ${reveal ? (isCorrect ? "correctAnswer" : "") : ""}`}
    >
      {content}
    </div>
  );
};

export default Choice;
