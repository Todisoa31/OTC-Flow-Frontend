'use client';

import { cn } from '@/utils/tailwind';
import React from 'react';

type Props = {
    label?: string,
    placeholder?: string,
    className?: string,
    type?: 'text' | 'password' | 'email' | 'number' | "date",
    width?: string,
    height?: string,
    rightIcon?: React.JSX.Element,
    leftIcon?: React.JSX.Element,
    value: string,
    isRequired?: boolean,
    multiline?: boolean,
    onChange?: (value: string) => void
    outline?: boolean,
    rounded?: string;
    disabled?: boolean;
    background?: string;
}

function Input(props: Props) {
    const { width, height, type, value, multiline, isRequired, label, outline, placeholder, className, leftIcon, rightIcon, onChange, rounded, disabled, background = "bg-white" } = props

    return (
        <div className={cn([`flex flex-col self-stretch justify-start items-start gap-[15px] ${width ? width : 'w-full'}`, className])}>
            {label &&
                <label className="text-dark-blue text-sm font-medium leading-[18px]">
                    <span className={`${(isRequired && value=="") ? "text-red font-bold": ""}`}>{label}</span> {isRequired && <span>(<span className="text-red font-bold">*</span>)</span>}:
                    {isRequired && value ==='' && <span className="text-red font-bold"> Ce champ est requis</span>}
                </label>
            }
            <div className={`inline-flex ${multiline ? 'px-0' : 'px-[10px]' } ${background} ${rounded ? rounded : "rounded-[10px]"} justify-between items-center ${outline ? 'outline outline-1 outline-offset-[-1px] outline-[#101828]/20' : ''} ${width ? width : 'w-full'} ${height ? height : 'h-[50px]'}
        `}>
                {
                    leftIcon ? <div data-svg-wrapper>{leftIcon}</div> : null
                }
                <div className="justify-start items-center gap-2.5 flex grow h-full">
                    {
                        multiline ?
                            <textarea
                                className={cn(["h-full p-[20px] grow self-stretch text-black-secondary text-sm font-normal leading-[18px] !outline-none focus:outline-none text-left text-[#646d81]", className])}
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => onChange?.(e.target.value)}
                                disabled={disabled}
                            />
                            :
                            <input
                                type={type ?? 'text'}
                                className={cn(["h-full px-[7px] text-black-secondary grow text-sm font-normal leading-[18px] !outline-none text-left", background])}
                                placeholder={placeholder}
                                value={value}
                                onChange={(e) => onChange?.(e.target.value)}
                                disabled= {disabled}
                            />
                    }

                </div>
                {
                    rightIcon ? <div data-svg-wrapper>{rightIcon}</div> : null
                }
            </div>
        </div>
    );
}

export default Input