'use client';

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Input from './Input';
import { SelectValue } from '@/types/inputType';
import { Check, LoaderCircle } from 'lucide-react';
import { PaginationType } from '@/types/general';
import SearchIcon2 from '@/assets/icons/SearchIcon2';
import { cn } from '@/utils/tailwind';
import CaretDownSelectIcon from '@/assets/icons/CaretDownSelectIcon';

interface Option {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    image?: string;
}

interface SelectProps {
    multiple: boolean;
    hideSelected?: boolean;
    search: boolean;
    value: SelectValue;
    onChange: (value: SelectValue) => void;
    options: Option[];
    placeholder?: string;
    width?: string;
    className?: string;
    labelClassName?: string;
    dropdownBackgroundColor?: string;
    icon?: React.ReactNode;
    iconColor?: string;
    withPagination?: boolean;
    pagination?: PaginationType;
    prevPage?: () => void;
    nextPage?: () => void;
    setSearchText?: Dispatch<SetStateAction<string>>;
    loading?: boolean;
}

const Select: React.FC<SelectProps> = ({
    multiple, hideSelected, search, value, onChange,
    options, placeholder, className = "w-full bg-white",
    dropdownBackgroundColor, width, withPagination,
    pagination, prevPage, nextPage, setSearchText,
    labelClassName, loading, iconColor
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);
    const [direction, setDirection] = useState<'up' | 'down'>('down');
    const [textSearch, setTextSearch] = useState('');

    const _options: Option[] = placeholder
        ? [{ label: placeholder, value: '' }, ...options]
        : options;

    const isSelected = (optionValue: string | number) => {
        if (multiple) {
            return Array.isArray(value) && value.includes(optionValue);
        }
        return value === optionValue;
    };

    const toggleSelection = (optionValue: string | number) => {
        if (multiple) {
            if (isSelected(optionValue)) {
                onChange((value as (string | number)[]).filter((val) => val !== optionValue));
            } else {
                onChange([...(value as (string | number)[] || []), optionValue]);
            }
        } else {
            onChange(optionValue);
            setIsOpen(false);
        }
    };

    const filteredOptions = _options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSearchChange = (value: string) => setQuery(value);

    const handleToggleDropdown = (event: any) => {
        if(loading) return;
        event.stopPropagation();
        setIsOpen((prev) => {
            const next = !prev;
            if (next && selectRef.current) {
                const rect = selectRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;
                setDirection(spaceBelow < 200 && spaceAbove > 200 ? 'up' : 'down');
            }
            return next;
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (setSearchText) setSearchText(textSearch);
    };

    const selectedOption = _options.find(opt => String(opt.value) === String(value));

    useEffect(() => {
        if (textSearch?.trim() === "") {
            if (setSearchText) setSearchText("");
        }
    }, [textSearch])

    return (
        <div ref={selectRef} className={`relative ${width ?? 'w-64'} overflow-visible`}>
            <button
                className={`${loading ?  'cursor-default' : 'cursor-pointer'} flex justify-between items-center px-[10px] py-[10px] rounded-[10px] cursor-pointer ${className}`}
                onClick={(e) => handleToggleDropdown(e)}
                disabled={loading}
            >
                <div className="flex flex-wrap items-center gap-2 text-dark-blue text-xs font-medium">
                    {multiple ? (
                        Array.isArray(value) && value.length > 0 ? (
                            hideSelected ? (
                                <span>{placeholder ?? 'Sélectionnez plusieurs'}</span>
                            ) : (
                                <div className="flex items-center gap-1">
                                    {(value as (string | number)[]).slice(0, 2).map((val) => {
                                        const item = _options.find((o) => o.value === val);
                                        return (
                                            <span
                                                key={val}
                                                className="flex items-center gap-1 bg-blue-100 rounded px-2 py-1 text-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelection(val);
                                                }}
                                            >
                                                {item?.image && (
                                                    <img src={item.image} alt={item.label} className="w-4 h-4 rounded-full object-cover" />
                                                )}
                                                {item?.icon}
                                                {item?.label}
                                            </span>
                                        );
                                    })}
                                    {value.length > 2 && (
                                        <span className="text-sm text-gray-500">+{value.length - 2} autres</span>
                                    )}
                                </div>
                            )
                        ) : (
                            <span>{placeholder ?? 'Aucun sélectionné'}</span>
                        )
                    ) : (
                        <span className="flex items-center gap-2" >
                            {selectedOption?.image && (
                                <img
                                    src={selectedOption.image}
                                    alt={selectedOption.label}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                            )}
                            <div>
                                {selectedOption?.icon}
                            </div>
                            <div className={cn(['max-w-[180px] truncate', labelClassName])} title={selectedOption?.label}>
                                {selectedOption?.label ?? placeholder ?? 'Aucun sélectionné'}
                            </div>
                        </span>
                    )}
                </div>

                <span className="shrink-0 px-2">
                    {loading ? <LoaderCircle size={20} className="animate-spin text-blue-500 mr-2" /> : <CaretDownSelectIcon color={iconColor} /> }
                </span>
            </button>

            {isOpen && (
                <div
                    className={`absolute left-0 right-0 z-[20] mt-1 shadow-lg rounded-md border overflow-hidden ${direction === 'down' ? 'top-full' : 'bottom-full mb-1'}`}
                    style={{ backgroundColor: dropdownBackgroundColor || 'white' }}
                >
                    {search && (
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            value={query}
                            onChange={(value) => handleSearchChange(value)}
                            height="h-[40px]"
                        />
                    )}

                    <div className="max-h-48 overflow-y-auto gap-2">
                        {filteredOptions.map((option, index) => {
                            const selected = isSelected(option.value);
                            return (
                                <button
                                    key={`${index}-${option.value}-${option.label}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(option.value)
                                    }}
                                    className={`p-3.5 cursor-pointer justify-between hover:bg-gray-200 w-full text-dark-blue text-sm font-medium text-left flex gap-2 items-center ${selected ? 'bg-blue-100' : ''}`}
                                >
                                    <div className="flex flex-row gap-2 items-center" >
                                        {option.image && (
                                            <img
                                                src={option.image}
                                                alt={option.label}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        )}
                                        {option.icon}
                                        {option.label}
                                    </div>
                                    {selected && multiple && (
                                        <Check className="w-4 h-4 text-green-600" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {withPagination && (
                        <div className="p-2">
                            <div className="p-2 border w-full rounded-md flex items-center">
                                <input
                                    className="px-2 outline-none w-full"
                                    type="search"
                                    value={textSearch}
                                    onChange={(e) => setTextSearch(e.target.value)}
                                />
                                <button onClick={handleSearch}>
                                    <SearchIcon2 />
                                </button>
                            </div>
                            <div className="flex justify-between items-center p-2">
                                <button
                                    className={(pagination?.page ?? 1) <= 1 ? "text-[#646E811A]" : "text-[#65A5BF]"}
                                    disabled={(pagination?.page ?? 1) <= 1}
                                    onClick={prevPage}
                                >
                                    Précédent
                                </button>
                                <span className="text-gray-500">
                                    Page {pagination?.page} sur {pagination?.total_pages}
                                </span>
                                <button className="text-[#65A5BF]" onClick={nextPage}>
                                    Suivant
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Select;