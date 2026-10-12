import { ChangeEvent, useEffect } from 'react';
import DocUploaderSuccess from './DocUploaderSuccess';
import DocUploaderError from './DocUploaderError';
import DocUploaderInitial from './DocUploaderInitial';
import DocUploaderUploading from './DocUploaderUploading';
import { toast } from 'react-toastify';
import { UseInstallerStore } from '@/stores/InstallerStore';
import { useParams, usePathname } from 'next/navigation';
import { INSTALLER_ROUTE } from '@/constants/routes';

export type UploadStatus = 'error' | 'success' | 'uploading' | 'initial' | 'extracting';

type Props = Readonly<{
    label: string;
    state?: UploadStatus;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    file?: File | null;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    noPadding?: boolean;
    acceptFiles?: string; 
}>

function DocUploader(props: Props) {
    const { label, state, onChange, file, inputRef, noPadding, acceptFiles } = props;
    const { setEventStart } = UseInstallerStore();
    const path = usePathname();
    const { id } = useParams();

    useEffect(() => {
        const exactPath = `${INSTALLER_ROUTE}/record_detail/${id}`
        if (state === 'success' && path === exactPath) {
            toast.info("N'oubliez pas de soumettre votre formulaire !");
            setEventStart(true);
        }
    }, [state])

    return (
        <>
            {!state || state === 'initial' && <DocUploaderInitial label={label} onChange={onChange} noPadding={noPadding} acceptFiles={acceptFiles}/>}
            {state === 'success' && <DocUploaderSuccess label={label} onChange={onChange} file={file} inputRef={inputRef} noPadding={noPadding} acceptFiles={acceptFiles}/>}
            {(state === 'uploading' || state === 'extracting') && <DocUploaderUploading label={label} onChange={onChange} file={file} status={state} noPadding={noPadding} acceptFiles={acceptFiles}/>}
            {state === 'error' && <DocUploaderError label={label} onChange={onChange} file={file} noPadding={noPadding} acceptFiles={acceptFiles}/>}
        </>)
}


export default DocUploader