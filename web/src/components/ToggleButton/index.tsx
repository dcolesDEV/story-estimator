import React from "react";

interface ToggleButtonProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean | undefined;
  setChecked: (checked: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  id,
  label,
  description,
  checked,
  setChecked,
}) => {
  return (
    <div className="my-8">
      <div className="flex items-center">
        <span>{label}</span>
        <label htmlFor={id} className="ml-auto cursor-pointer">
          <div className="toggle-button relative">
            <input
              type="checkbox"
              id={id}
              className="sr-only"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <div className="block bg-gray-300 dark:bg-gray-700 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 dark:bg-gray-800 bg-gray-400 w-6 h-6 rounded-full transition"></div>
          </div>
        </label>
      </div>
      {description && (
        <div className="opacity-60 text-sm w-10/12">{description}</div>
      )}
    </div>
  );
};

export default ToggleButton;

