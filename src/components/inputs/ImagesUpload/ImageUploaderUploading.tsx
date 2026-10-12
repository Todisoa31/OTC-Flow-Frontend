import PencilIcon from '@/assets/icons/PencilIcon';
import FileTextIcon from '@/assets/icons/FileTextIcon';
import { stringToSlug } from '@/utils/common';
import { LoaderCircle } from 'lucide-react';

type Props = {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    file?: File | null;
    status: 'uploading' | 'extracting';
    noPadding?: boolean;
};

function ImageUploaderUploading(props: Props) {
    const { label, onChange, file, status, noPadding } = props;
    const labelClass = stringToSlug(`${label}-uploading-extracting`);
    const statusLabel = status === 'uploading' ? 'Upload' : 'Vérification';

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
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={onChange}
                    className="hidden"
                    id={labelClass}
                />
                <div data-svg-wrapper className="relative flex gap-2 items-center">
                    <LoaderCircle size={25} className="animate-spin text-blue-500" />
                    <span className='text-xs text-dark-blue'>{statusLabel}</span>
                </div>
            </div>
        </div>
    );
}

export default ImageUploaderUploading; 