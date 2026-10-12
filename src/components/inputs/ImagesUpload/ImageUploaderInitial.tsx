import React, { useEffect, useRef } from 'react';
import AddImageIcon from '@/assets/icons/AddImageIcon';
import { stringToSlug } from '@/utils/common';
import { Uploadedfile } from '@/types/recordType';
import { useRecords } from '@/providers/CreateRecordProvider';

type Props = {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ImageUploaderInitial(props: Props) {
    const { label, onChange } = props;
    const labelClass = stringToSlug(`${label}-initial`);
    const fileInputRef = useRef<HTMLInputElement>(null);
    

    return (
        <div className="self-stretch grow h-[75px] px-[30px] flex-col justify-center items-start gap-[15px] flex">
            {label && <div className="text-dark-blue text-sm font-medium leading-[18px]">{label}:</div>}
            <label htmlFor={labelClass} className="parent-div self-stretch h-[50px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 justify-center items-center gap-2.5 inline-flex cursor-pointer">
                <div data-svg-wrapper className="relative"><AddImageIcon /></div>
                <div className="text-dark-blue text-xs font-bold leading-[18px]">Ajouter une photo (jpg, png)</div>
            </label>
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={onChange}
                className="hidden"
                id={labelClass}
                ref={fileInputRef}
            />
        </div>
    );
}

export default ImageUploaderInitial; 