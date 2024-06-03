import React from "react";
import { LoaderCircle, CircleDashed } from "lucide-react"; // Assuming Loader2 is another loader icon

interface LoaderProps {
  button?: boolean;
  fullScreen?: boolean;
  size?: number;
  color?: string;
  type?: "circle" | "spinner";
  stroke?: number;
}

const Loader: React.FC<LoaderProps> = ({
  button,
  fullScreen,
  size = 24,
  color = "currentColor",
  type = "circle",
  stroke = 1,
}) => {
  const getLoaderIcon = () => {
    switch (type) {
      case "spinner":
        return (
          <CircleDashed
            size={size}
            strokeWidth={stroke}
            className="animate-spin"
            style={{ color }}
            aria-label="Loading"
          />
        );
      case "circle":
        return (
          <LoaderCircle
            size={size}
            className="animate-spin"
            style={{ color }}
            aria-label="Loading"
          />
        );
      default:
        return (
          <LoaderCircle
            size={size}
            className="animate-spin"
            style={{ color }}
            aria-label="Loading"
          />
        );
    }
  };

  const spinner = getLoaderIcon();

  if (button) {
    return spinner;
  }

  const containerClass = fullScreen
    ? "flex justify-center items-center h-screen"
    : "flex justify-center items-center";

  return <div className={containerClass}>{spinner}</div>;
};

export default Loader;
