import React from 'react';
import AddFileIcon from '@/assets/icons/AddFileIcon';
import { stringToSlug } from '@/utils/common';

type Props = {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    noPadding?: boolean;
    acceptFiles?: string; 
};

function DocUploaderInitial(props: Props) {
    const { label, onChange, noPadding, acceptFiles } = props;
    const labelClass = stringToSlug(`${label}-initial`);

    return (
        <div className={`self-stretch grow h-[75px] ${noPadding? 'px-0': 'px-[30px]'} flex-col justify-center items-start gap-[15px] flex`}>
            {label && <div className="text-dark-blue text-sm font-medium leading-[18px]">{label}:</div> }
            <label htmlFor={labelClass} className="parent-div self-stretch h-[50px] px-[15px] bg-white rounded-[10px] border border-dashed border-[#101828]/20 justify-center items-center gap-2.5 inline-flex cursor-pointer">
                <div data-svg-wrapper className="relative"><AddFileIcon /></div>
                <div className="text-dark-blue text-xs font-bold leading-[18px]">Ajouter un fichier (Docx, PDF)</div>
            </label>
            <input
                type="file"
                accept={acceptFiles || ".pdf"}
                onChange={onChange}
                className="hidden"
                id={labelClass}
            />
        </div>
    );
}

export default DocUploaderInitial;