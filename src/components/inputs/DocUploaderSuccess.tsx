import PencilIcon from '@/assets/icons/PencilIcon';
import FileTextIcon from '@/assets/icons/FileTextIcon';
import CheckCircleIcon from '@/assets/icons/CheckCircleIcon';
import { stringToSlug } from '@/utils/common';

type Props = {
    label: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    file?: File | null;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    noPadding?: boolean;
    acceptFiles?: string;
}


function DocUploaderSuccess(props: Props) {
    const { label, onChange, file, noPadding, inputRef, acceptFiles } = props
    const labelClass = stringToSlug(`${label}-success`);

    return (
        <div className={`self-stretch grow h-[75px] ${noPadding? 'px-0': 'px-[30px]'} flex-col justify-center items-start gap-[15px] flex`}>
            {label && <div className="text-dark-blue text-sm font-medium leading-[18px]">{label} :</div>}
            <div className="self-stretch min-h-[50px] h-auto px-[15px] bg-white rounded-[10px] border-2 border-primary-blue justify-start items-center gap-2.5 inline-flex">
                <div data-svg-wrapper className="relative">
                    <FileTextIcon/>
                </div>
                <div className="grow shrink basis-0 text-dark-blue text-xs font-bold leading-[18px]">{file?.name}</div>
                <label htmlFor={labelClass} data-svg-wrapper className="relative cursor-pointer">
                    <PencilIcon/>
                </label>
                <input
                    type="file"
                    accept={acceptFiles || ".docx,.pdf"}
                    onChange={onChange}
                    className="hidden"
                    id={labelClass}
                    ref={inputRef} // Use the inputRef prop to allow external control of the input
                />
                <div data-svg-wrapper className="relative">
                    <CheckCircleIcon/>
                </div>
            </div>
        </div>
    )
}

export default DocUploaderSuccess