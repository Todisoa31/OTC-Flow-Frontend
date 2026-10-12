'use client';;
import React, { MouseEventHandler } from 'react';
import { LoaderCircle } from "lucide-react";
import { cn } from '@/utils/tailwind';

type Props = {
    label?: string,
    iconLeft?: React.JSX.Element,
    iconRight?: React.JSX.Element
    width?: string,
    height?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>;
    bg?: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: Props) {
    const {label, onClick, iconLeft, iconRight, width, height, bg, loading, labelClassName, disabled, className } = props
    return (
        <button 
            className={cn([`
                 !px-3 rounded-[10px] shadow-[0px_10px_40px_0px_primary-blue] justify-center items-center gap-2.5 inline-flex font-bold
                ${width ? width : ''}
                ${height ? height : '!h-[40px]'}
                ${bg ? bg : 'bg-primary-blue'}
            `, className])}
            onClick={onClick}
            disabled={loading || disabled}
        >
            {loading && 
                <span className="loader">
                    <LoaderCircle size={25} className="animate-spin text-blue-500" />
                </span>
            }
            {!loading && iconLeft && <span data-svg-wrapper className="relative">{iconLeft}</span>}
            {label && <span className={cn(["text-white text-xs  leading-[18px] text-center", labelClassName])}>{label}</span> }
            {!loading && iconRight && <span data-svg-wrapper className="relative">{iconRight}</span>}
        </button>
    )
}

export default Button