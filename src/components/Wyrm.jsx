import React, { useState, useEffect } from "react";
import "../styles/Wyrm.css";
import Keypad from "./Keypad";

const initialSnake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];

const initialDirection = { x: 1, y: 0 };

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  };
}

function Wyrm() {
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState(initialDirection);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [food, setFood] = useState(getRandomPosition());
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    const interval = setInterval(() => {
      setSnake((oldSnake) => {
        const newSnake = [...oldSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        newSnake.unshift(head);

        // Collision with wall
        if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20) {
          setGameOver(true);
          return oldSnake;
        }

        // Collision with self
        if (
          newSnake.some(
            (part, index) =>
              index !== 0 && part.x === head.x && part.y === head.y
          )
        ) {
          setGameOver(true);
          return oldSnake;
        }

        // Eating food
        if (head.x === food.x && head.y === food.y) {
          setScore((score) => score + 1);
          setFood(() => getRandomPosition());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, gameStarted, gameOver, food, setScore, setFood]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setSnake(initialSnake);
    setDirection(initialDirection);
  };

  useEffect(() => {
    if (gameOver) {
      setShowNameInput(true);
      setFinalScore(score); // Set the final score when the game is over
    }
  }, [gameOver]);

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ name: playerName, score: finalScore }); // Use the final score here
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.length = Math.min(leaderboard.length, 5); // Keep only top 5 scores
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    setPlayerName(""); // Reset player's name
    setScore(0); // Reset score
    setShowNameInput(false);
  };

  const changeDirection = (event) => {
    switch (event.key) {
      case "ArrowUp":
        setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        setDirection({ x: 1, y: 0 });
        break;
      default:
    }
  };

  return (
    <div className="wyrm">
      {!gameStarted ? (
        <div className="wyrm-menu">
          <h2 className="wyrm-text">Press Start to Play Snake</h2>
          <div className="wyrm-text">LeaderBoard</div>
          {localStorage.getItem("leaderboard") ? (
            JSON.parse(localStorage.getItem("leaderboard")).map(
              (entry, index) => (
                <div key={index}>
                  {entry.name}: {entry.score}
                </div>
              )
            )
          ) : (
            <div>No leaderboard data</div>
          )}
          <button className="wyrm-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : showNameInput ? (
        <div className="wyrm-menu">
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              maxLength="3"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : gameOver ? (
        <div className="wyrm-menu">
          <div className="wyrm-text">Game Over</div>
          <div className="wyrm-text">You scored : {score}</div>
          <div className="wyrm-text">LeaderBoard</div>
          {localStorage.getItem("leaderboard") ? (
            JSON.parse(localStorage.getItem("leaderboard")).map(
              (entry, index) => (
                <div key={index}>
                  {entry.name}: {entry.score}
                </div>
              )
            )
          ) : (
            <div>No leaderboard data</div>
          )}
          <button className="wyrm-button" onClick={startGame}>
            Try Again
          </button>
          <button className="wyrm-button" onClick={() => setGameStarted(false)}>
            return
          </button>
        </div>
      ) : (
        <div tabIndex="0" onKeyDown={changeDirection}>
          <div>Score: {score}</div>
          <div className="wyrm-grid">
            {Array.from({ length: 20 }, (_, y) =>
              Array.from({ length: 20 }, (_, x) => ({ x, y }))
            )
              .flat()
              .map((cell, index) => {
                const isSnakePart = snake.some(
                  (part) => part.x === cell.x && part.y === cell.y
                );
                const isHead =
                  isSnakePart && cell.x === snake[0].x && cell.y === snake[0].y;
                const isFood = cell.x === food.x && cell.y === food.y;

                let cellClass = "wyrm-cell-white";
                if (isSnakePart) {
                  cellClass = isHead ? "wyrm-cell-head" : "wyrm-cell-body";
                } else if (isFood) {
                  cellClass = "wyrm-cell-red";
                }

                return <div key={index} className={`wyrm-cell ${cellClass}`} />;
              })}
          </div>
          <Keypad onKeyPress={(direction) => setDirection(direction)} />
        </div>
      )}
    </div>
  );
}

export default Wyrm;
