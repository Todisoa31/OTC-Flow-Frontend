import React from "react";

type Props = {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
};

const ProgressCircle: React.FC<Props> = ({ value, total, size = 70, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / total, 1);
  const offset = circumference * (1 - progress);

  // Déterminer la couleur selon le pourcentage
  const percent = progress * 100;
  let strokeColor = "#EC4899"; // rose par défaut

  if (percent < 50) strokeColor = "#FCC567";       // jaune
  else if (percent < 75) strokeColor = "#65BFAA";  // vert menthe

  const fontSize = size * 0.2;

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 15,
        paddingBottom: 15
      }}
    >
      <svg width={size} height={size}>
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Texte centré */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#1F2937"
        >
          {value}/{total}
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;
