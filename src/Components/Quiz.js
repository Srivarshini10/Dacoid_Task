import React, { useState, useEffect } from "react";
import "./Quiz.css";

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
);

const Card = ({ children }) => <div className="card">{children}</div>;

const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

const sampleQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    question: "Which planet is closest to the Sun?",
    options: [
      { id: "A", text: "Venus" },
      { id: "B", text: "Mercury" },
      { id: "C", text: "Earth" },
      { id: "D", text: "Mars" },
    ],
    correctOption: "B",
  },
  {
    id: 2,
    type: "multiple-choice",
    question:
      "Which data structure organizes items in a First-In, First-Out (FIFO) manner?",
    options: [
      { id: "A", text: "Stack" },
      { id: "B", text: "Queue" },
      { id: "C", text: "Tree" },
      { id: "D", text: "Graph" },
    ],
    correctOption: "B",
  },
  {
    id: 3,
    type: "multiple-choice",
    question:
      "Which of the following is primarily used for structuring web pages?",
    options: [
      { id: "A", text: "Python" },
      { id: "B", text: "Java" },
      { id: "C", text: "HTML" },
      { id: "D", text: "C++" },
    ],
    correctOption: "C",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Which chemical symbol stands for Gold?",
    options: [
      { id: "A", text: "Au" },
      { id: "B", text: "Gd" },
      { id: "C", text: "Ag" },
      { id: "D", text: "Pt" },
    ],
    correctOption: "A",
  },
  {
    id: 5,
    type: "multiple-choice",
    question:
      "Which of these processes is not typically involved in refining petroleum?",
    options: [
      { id: "A", text: "Fractional distillation" },
      { id: "B", text: "Cracking" },
      { id: "C", text: "Polymerization" },
      { id: "D", text: "Filtration" },
    ],
    correctOption: "D",
  },
  {
    id: 6,
    type: "integer",
    question: "What is the value of 12 + 28?",
    correctAnswer: 40,
  },
  {
    id: 7,
    type: "integer",
    question: "How many states are there in the United States?",
    correctAnswer: 50,
  },
  {
    id: 8,
    type: "integer",
    question: "In which year was the Declaration of Independence signed?",
    correctAnswer: 1776,
  },
  {
    id: 9,
    type: "integer",
    question: "What is the value of pi rounded to the nearest integer?",
    correctAnswer: 3,
  },
  {
    id: 10,
    type: "integer",
    question:
      "If a car travels at 60 mph for 2 hours, how many miles does it travel?",
    correctAnswer: 120,
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    if (!quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            nextQuestion();
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestion, quizCompleted]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === sampleQuestions[currentQuestion].correctOption) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback("❌ Wrong!");
    }
  };

  const handleIntegerSubmit = () => {
    if (
      parseInt(integerAnswer) === sampleQuestions[currentQuestion].correctAnswer
    ) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback("❌ Wrong!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIntegerAnswer("");
      setFeedback("");
      setTimeLeft(30);
    } else {
      setQuizCompleted(true);
      const newAttempt = {
        date: new Date().toLocaleString(),
        score: score,
        totalQuestions: sampleQuestions.length,
      };
      const updatedHistory = [newAttempt, ...History];
      setHistory(updatedHistory);
      localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
    }
  };

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <Card>
          <CardContent>
            <div className="progress">{`${currentQuestion + 1}/${
              sampleQuestions.length
            }`}</div>

            <div className="timer-circle">
              <span>{timeLeft}</span>
            </div>

            <h2 className="question">
              {sampleQuestions[currentQuestion].question}
            </h2>

            {sampleQuestions[currentQuestion].type === "multiple-choice" ? (
              sampleQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className={selectedOption === option.id ? "selected" : ""}
                >
                  {option.text}
                </Button>
              ))
            ) : (
              <>
                <input
                  type="number"
                  value={integerAnswer}
                  onChange={(e) => setIntegerAnswer(e.target.value)}
                  className="input-field"
                />
                <Button onClick={handleIntegerSubmit} className="submit-button">
                  Submit Answer
                </Button>
              </>
            )}
            <p className="feedback">{feedback}</p>
            <Button onClick={nextQuestion} className="next-button">
              {currentQuestion < sampleQuestions.length - 1
                ? "Next →"
                : "Finish Quiz"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <h2 className="quiz-completed">Quiz Completed! 🎉</h2>
            <p className="score">
              Your Score: <br />
              {score}/{sampleQuestions.length}
            </p>
            <h3 className="history-title">Attempt History</h3>
            <ul className="history-list">
              {history.map((attempt, index) => (
                <li key={index}>
                  Attempt {index + 1}: {attempt.score}/{attempt.total}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Retry Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
