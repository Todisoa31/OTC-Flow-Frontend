import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-4",
  lg: "h-10 w-10 border-4",
};

export default function Spinner({ size = "md" }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-gray-900 ${sizeMap[size]}`}
    />
  );
}
