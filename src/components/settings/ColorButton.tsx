import React from "react";

interface DiagonalButtonProps {
  color: "purple" | "green" | "blue";
  onClick?: () => void;
}

const ColorButton: React.FC<DiagonalButtonProps> = ({ color, onClick }) => {
  const colorMap = {
    purple: ["#8e44ad", "#d2b4de"],
    green: ["#27ae60", "#7dcea0"],
    blue: ["#2980b9", "#85c1e9"],
  };

  const [color1, color2] = colorMap[color] || ["#ccc", "#eee"];

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        width: "75px",
        height: "40px",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 80 40">
        {/* Mitad superior izquierda */}
        <polygon points="0,0 80,0 0,40" fill={color1} />
        {/* Mitad inferior derecha */}
        <polygon points="80,40 80,0 0,40" fill={color2} />
      </svg>
    </button>
  );
};

export default ColorButton;
