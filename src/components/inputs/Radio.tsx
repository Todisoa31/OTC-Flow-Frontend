import React from "react";

type Props = Readonly<{
  checked: boolean;
  onChange: (newValue: boolean) => void;
  title: string;
}>;

export default function Radio({ checked, onChange, title }: Props) {
  return (
    <div className="flex w-fit items-center gap-2 cursor-pointer w-full px-[30px]" onClick={() => onChange(!checked)}>
      {checked ? (
        <svg width="50" height="26" viewBox="0 0 50 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="50" height="26" rx="13" fill="#65A5BF" />
                        <circle cx="37" cy="13" r="10" fill="white" />
                    </svg>
      ) : (
        <svg width="50" height="26" viewBox="0 0 50 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="50" height="26" rx="13" fill="#686868" fillOpacity="0.4" />
            <circle cx="13" cy="13" r="10" fill="white" />
        </svg>
      )}

       <span className="text-dark-blue text-sm font-medium leading-[18px]">{title}</span>
    </div>
  );
}
