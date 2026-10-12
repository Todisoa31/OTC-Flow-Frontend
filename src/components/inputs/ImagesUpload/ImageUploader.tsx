import { ChangeEvent } from 'react';
import ImageUploaderSuccess from './ImageUploaderSuccess';
import ImageUploaderError from './ImageUploaderError';
import ImageUploaderInitial from './ImageUploaderInitial';
import ImageUploaderUploading from './ImageUploaderUploading';
import ImageUploaderList from './ImageUploaderList';
import { UploadStatus } from '../DocUploader';

type Props = Readonly<{
    label: string;
    state?: UploadStatus;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    file?: File | null;
    uploadedImages?: { id: number; url: string; file: File }[];
    onRemoveImage?: (id: number) => void;
}>;

function ImageUploader(props: Props) {
    const { label, state, onChange, file, uploadedImages = [], onRemoveImage } = props;

    return (
        <>
            {uploadedImages.length > 0 && onRemoveImage && (
                <div className="mt-4 w-full">
                    <ImageUploaderList 
                        images={uploadedImages}
                        onRemove={onRemoveImage}
                    />
                </div>
            )}
            {!state || state === 'initial' && <ImageUploaderInitial label={label} onChange={onChange} />}
            {state === 'success' && <ImageUploaderSuccess label={label} onChange={onChange} file={file} />}
            {(state === 'uploading' || state === 'extracting') && <ImageUploaderUploading label={label} onChange={onChange} file={file} status={state} />}
            {state === 'error' && <ImageUploaderError label={label} onChange={onChange} file={file} />}
            
        </>
    );
}

export default ImageUploader;