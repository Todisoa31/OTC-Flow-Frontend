import PencilIcon from '@/assets/icons/PencilIcon';
import FileTextIcon from '@/assets/icons/FileTextIcon';
import DangerCircleIcon from '@/assets/icons/DangerCircleIcon';
import { stringToSlug } from '@/utils/common';

type Props = {
    label: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    file?: File | null;
    noPadding?: boolean;
    acceptFiles?: string;
}

function DocUploaderError(props: Props) {
    const { label, onChange, file, noPadding, acceptFiles } = props
    const labelClass = stringToSlug(`${label}-error`);

    return (
        <div className={`self-stretch grow h-auto min-h-[75px] ${noPadding?"px-0": "px-[30px]"} flex-col justify-center items-start gap-[15px] flex`}>
            {label && <div className="text-dark-blue text-sm font-medium leading-[18px]">{label} :</div> }
            <div className="self-stretch min-h-[50px] px-[15px] bg-white rounded-[10px] border-2 border-[#c70042] justify-start items-center gap-2.5 inline-flex">
                <div data-svg-wrapper className="relative">
                    <FileTextIcon/>
                </div>
                <div className="grow shrink basis-0 text-dark-blue text-xs font-bold leading-[18px]">{file?.name}</div>
                <div className="px-2.5 py-[7px] bg-[#c70042]/10 rounded-[10px] justify-center items-center gap-2.5 flex">
                    <div className="text-[#c70042] text-xs font-medium">
                        {/*Le document soumis est illisible ou de mauvaise qualité.*/}
                        {"Une erreur c'est produite lors de l'envoi du document."}
                    </div>
                </div>
                <label htmlFor={labelClass} data-svg-wrapper className="relative cursor-pointer">
                    <PencilIcon/>
                </label>
                <input
                    type="file"
                    accept={acceptFiles || ".docx,.pdf"}
                    onChange={onChange}
                    className="hidden"
                    id={labelClass}
                />
                <div data-svg-wrapper>
                    <DangerCircleIcon/>
                </div>
            </div>
        </div>
    )
}

export default DocUploaderError