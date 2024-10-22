import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsGenerated } from "../../../Redux/Reducers/QuestionsReducer";

const TypingEffect = ({ text, index }) => {
  const dispatch = useDispatch();
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const quiz = useSelector((state) => state.questions.quiz);
  const isGenerated = quiz[index]?.isGenerated;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setCurrentText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        if (!isGenerated) {
          dispatch(setIsGenerated({ index }));
        }
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 100);
    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [text, index, isGenerated, dispatch]);

  return (
    <>
      {isGenerated ? (
        <span>{text}</span>
      ) : (
        <span>
          {currentText}
          {showCursor && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}
        </span>
      )}
    </>
  );
};

export default TypingEffect;
