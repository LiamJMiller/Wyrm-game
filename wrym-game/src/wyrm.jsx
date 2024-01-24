import React, { useState, useEffect } from "react";

const initialSnake = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
];

const initialDirection = { x: 1, y: 0 };

function Wyrm() {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((oldSnake) => {
        const newSnake = [...oldSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };
        newSnake.unshift(head);
        newSnake.pop();
        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction]);

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
    <div
      tabIndex="0"
      onKeyDown={changeDirection}
      style={{
        // height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(20, 20px)",
          gridTemplateRows: "repeat(20, 20px)",
        }}
      >
        {Array.from({ length: 20 }, (_, y) =>
          Array.from({ length: 20 }, (_, x) => ({ x, y }))
        )
          .flat()
          .map((cell, index) => (
            <div
              key={index}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid black",
                backgroundColor: snake.some(
                  (part) => part.x === cell.x && part.y === cell.y
                )
                  ? "black"
                  : "white",
              }}
            />
          ))}
      </div>
    </div>
  );
}

export default Wyrm;
