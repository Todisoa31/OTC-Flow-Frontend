import React, { useState } from "react";
import { cn } from "@/utils/tailwind";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  icon?: React.ReactNode;
  enableToggle?: boolean;
  onGenerate?: () => void;
  update?: () => void;
  generateIcon?: React.ReactNode;
  updateIcon?: React.ReactNode;
  className?: string;
  show?: boolean;
  onToggleShow?: () => void;
}

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChange,
  isRequired,
  icon,
  enableToggle = true,
  onGenerate,
  update,
  generateIcon,
  updateIcon,
  className,
  show,
  onToggleShow,
}: PasswordInputProps) => {
  const [localShow, setLocalShow] = useState(false);
  const isVisible = show ?? localShow;
  const handleToggle = onToggleShow || (() => setLocalShow((prev) => !prev));

  return (
    <div
      className={cn(
        "flex flex-col self-stretch justify-start items-start gap-[15px] w-full",
        className
      )}
    >
      {label && (
        <label className="text-dark-blue text-sm font-medium leading-[18px]">
          {label}{" "}
          {isRequired && (
            <span>
              (<span className="text-red font-bold">*</span>)
            </span>
          )}
          :
        </label>
      )}
      <div
        className={cn(
          "inline-flex px-[10px] pr-0 rounded-[10px] justify-between items-center w-full h-[50px]",
          update ? "bg-gray-100" : "bg-white"
        )}
      >
        <div className="flex justify-start items-center gap-2.5 grow h-full">
          <input
            type={isVisible ? "text" : "password"}
            className="h-full px-[7px] text-black-secondary grow text-sm font-normal leading-[18px] text-left outline-none bg-transparent"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        {enableToggle && icon && (
          <button
            type="button"
            onClick={handleToggle}
            className="h-[34px] w-[34px] flex items-center justify-center text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
        {icon}
          </button>
        )}

        {onGenerate && !update && (
          <button
            type="button"
            onClick={onGenerate}
            className="ml-2 h-full px-3 rounded-r-[8px] bg-gray-900 text-white flex items-center gap-1 text-sm hover:bg-gray-800 transition"
          >
            {generateIcon}
            Générer
          </button>
        )}
        {update && (
          <button
            type="button"
            onClick={update}
            className="ml-2 h-full px-3 rounded-r-[8px] bg-gray-950 text-white flex items-center gap-1 text-sm hover:bg-gray-800 transition"
          >
            {updateIcon}
            <span className="text-white font-['Roboto'] text-[14px] font-medium leading-[18px]">
              Modifié
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
