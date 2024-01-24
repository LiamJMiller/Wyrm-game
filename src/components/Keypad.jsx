import "../styles/Keypad.css";

function Keypad({ onKeyPress }) {
  const keys = [
    { label: "Up", direction: { x: 0, y: -1 } },
    { label: "Down", direction: { x: 0, y: 1 } },
    { label: "Left", direction: { x: -1, y: 0 } },
    { label: "Right", direction: { x: 1, y: 0 } },
  ];

  return (
    <div className="keypad">
      {keys.map((key) => (
        <button
          key={key.label}
          data-key={key.label}
          onClick={() => onKeyPress(key.direction)}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}

export default Keypad;
